// CONFIGURAZIONE SERVER ---------------------------------------------------|
const express = require('express');    // Framework per creare server web
const multer = require('multer');      // Middleware per gestire il caricamento di file
const path = require('path');          // Utility per lavorare con percorsi di file e directory
const fs = require('fs');              // File System per lavorare con file e directory 
const csvParse = require('csv-parse'); // Per convertire csv in json

const app = express();                        // Crea un'app Express
const PORT = 3000;                            // Porta su cui il server ascolta

const UPLOAD_PATH = './upload/'; // PATH di salvataggio dati

app.use(express.static('public'));     // direttiva file statici

// Librerie statiche pubbliche ------------------------------------------------------------------|

// __dirname è il path relativo alla posizione del server.js variabile globale di node.js
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/chart', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Script --------------------------------------------------------------------|
const {normalizeDate,normalizeTime} = require('./utils/normalize.js');
const {readFilesList,addFileList,removeFile} = require('./utils/filesUtility.js');
const {removeDataFile} = require('./utils/dataUtility.js');


// per inviare richieste con body json
app.use(express.json());


const FILES_LIST_PATH = path.join(__dirname, 'upload', 'files.json'); // Percorso completo del file JSON che conterrà la lista dei file caricati

// CREO il file per la GESTIONE DEI FILES --------------------------------------|
// Controllo se il file.json esiste già nella cartella /upload
if (!fs.existsSync(FILES_LIST_PATH)) {
  fs.writeFileSync(FILES_LIST_PATH, '[]', 'utf8');  // Se NON esiste, lo CREO con un array vuoto
  console.log("[files.json] è stato creato!\n")
}
else
  console.log("[files.json] esiste già!\n");

// MULTER CARICAMENTO FILE -----------------------------------------------------------|
// salvataggio file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


// ****************************** ENDPOINT ******************************|

// REQUEST ---------------------------------------------------------------------------|
// Endpoint POST per il caricamento file
app.post('/upload', upload.single('file'), (req, res) => {

  // LOG DI DEBUG --------------------|
  // console.log('req.body:', req.body);
  // console.log('req.file:', req.file,"\n");
  // ---------------------------------|

  // Verifica contenuto
  if (!req.file) {
    return res.type('text/plain').status(404).send('Nessun file caricato!');
  }
  // SALVATAGGIO Informazioni form Upload
  const citta = req.body.citta;
  const ente = req.body.ente;
  const csvFilePath = req.file.path;
  const csvFileName = req.file.filename;     


  // LOG DI DEBUG --------------------|
  // console.log('Città:', citta);
  // console.log('Ente:', ente);
  // console.log('Percorso file:', csvFilePath + "\n");
  // ---------------------------------|

// -- Controllo se esiste già -------------------------------|
  const jsonFileName = req.file.filename.replace(/\.csv$/i, '.json');

  const files = readFilesList();  // ottengo l'array di oggetti

  // Log per debug del confronto
  console.log("\n|---------Match:---------|\n");
  console.log("jsonFileName: ",jsonFileName,);  
  files.forEach(f => console.log("f.filename: ", f.filename));

  if (files.some(f => f.filename === jsonFileName)) { 
    // elimino il file csv già presente che multer ha già caricato in automatico in storage precedentemente definito
    fs.unlink(csvFilePath, (err) => {
            if (err) 
              console.error('Errore nella rimozione del file CSV: ', err);
            else 
              console.log('File CSV rimosso:', csvFilePath);
          });
    return res.status(400).type('text/plain').send('File già esistente!'); 
  }


  const dati = [];     // variabile di salvataggio dati

  fs.createReadStream(csvFilePath)  // stream di lettura sul file csv    
    .pipe(  // Passa lo stream al parser
          csvParse.parse({  // Converto riga per riga in oggetto Js
                           columns: true,   // Indica che ci sono le chiavi nella prima riga
                           trim: true       // Rimuovo spazi iniziali/finali
                          }))
    // 'data' - Ad ogni nuovo chunk disponibile (oggetto completo)
    .on('data', (chunk) => { // chunk ricevuto dall'evento 'data' dello stream appena parsato
        // normalizzo la data
        if (chunk.data) 
          chunk.data = normalizeDate(chunk.data);
        // normalizzo l'orario
        if (chunk.ora) 
          chunk.ora = normalizeTime(chunk.ora);
      // aggiungo all'array l'oggetto js normalizzato
      dati.push(chunk);
    })
    // 'end' - Alla fine dello stream (esauriti i chunk) 
    .on('end', () => {

      console.log("il primo oggetto:",dati.slice(0, 1), "\n"); // LOG di DEBUG -----------|
      console.log("csvNameFile: [",csvFileName ,"]\n"); // LOG di DEBUG -----------|
/* ------------------------------------------------------------------------------------------------------------------------*/
      // OPENDATA: Oggetto da Salvare -------------------------|
      const outputObject = {
        citta: citta, 
        ente: ente,
        filename: jsonFileName,
        dati: dati
      };
      // --------------------------------------------|
      
      // Percorso di salvataggio file caricato
      const outputPath = path.join(__dirname, 'upload', jsonFileName);
      console.log("OutputPath:["+outputPath+"]");

      // Scrivo come oggetto JSON
      fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), (err) => {
        if (err) {  // in caso di errore stampo la risposta catturata
          console.error('Errore nella scrittura del file JSON:' + err); 
          return res.type('text/plain').status(500).send('Errore nella scrittura del file JSON.');
        }
        else    
          console.log('File JSON scritto correttamente su:', outputPath);

      // AGGINTA FILE A GESTORE DI FILES ------------------|
      // FILES: Creo l'obj del file corrente
      const newFile = {   
        filename: jsonFileName, 
            path: path.join('upload', jsonFileName),
           citta: citta,
            ente: ente
      };

      // Aggiungo l'obj al gestore
      addFileList(newFile);  
      // END AGGINTA A GESTORE ----------------------------|


      // cancello il .csv da /Update
      fs.unlink(csvFilePath, (err) => {
        if (err) console.error('Errore nella rimozione del file CSV: '+ err);
        else console.log('File CSV rimosso:', csvFilePath);
      });

        
        res.type('text/plain').status(201).send('File caricato e converito correttamente!');
      });
    }) // END 

    // Errore Del Parsing nello Stream
    .on('error', function(err) {
      console.error('Errore nel parsing: ' + err);
      res.type('text/plain').status(500).send('Errore nel parsing del CSV.');
    });

}); // END Handler

// Endpoint per aggiungere un nuovo elemento
app.post('/newItem', (req, res) => {
  // elemento da aggiungere
  const newItem = req.body;   
  // Salvo il file su cui operare
  const fileInUse = newItem.filename;
  // Elimino il nome che non serve tra le misurazioni
  delete newItem.fileInUse;
  console.log('File in uso:',fileInUse,'\n');
  console.log('Nuovo item ricevuto:', newItem,'\n');
  // Lettura db
  fs.readFile(path.join(UPLOAD_PATH,fileInUse), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Errore lettura DB' });

    // converto in oggetto js
    const database = JSON.parse(data);

    database.dati.push(newItem); // aggiungo l'elemento 

    // scrivo le modifiche in json
    fs.writeFile(path.join(UPLOAD_PATH,fileInUse), JSON.stringify(database, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Errore scrittura DB' });
      // risposta server sucess
      res.status(200).json({ message: 'Misurazione aggiunta con successo!' });
    });
  });
});

// END REQUEST ----------------------------------------------------------------------------------|


// Endpoint GET per leggere il file in uso ------------------------------------------------|
app.get('/upload/data/:filename', (req, res) => {

  try{
    // Legge il contenuto del file come stringa 
    const data = fs.readFileSync(path.join(UPLOAD_PATH,req.params.filename));
    res.type('application/json').status(200).send(data);
  }catch(e){
    console.error("Errore lettura: " + e);
    res.type('text/plain').status(500).send("Errore nella lettura del file");
  }
});
// ----------------------------------------------------------------------------------------------|

// Endpoint GET leggere i files ------------------------------------------------|
app.get('/get/files', (req,res) => {

  try{
    const files = fs.readFileSync('./upload/files.json', 'utf8');
    res.type('application/json').status(200).send(files);
  }catch(e){
    console.error("Errore lettura: ",e);
    res.type('text/plain').status(500).send("Errore nella lettura del gestore files");
  }

});

// Endpoint per rimuovere un file caricato -----------------------------------------------------|
app.delete('/deletefiles/:nome',(req,res) => {
  removeDataFile(req.params.nome);
try{
  // Eliminare i dati.json
  removeDataFile(req.params.nome);
  // Elimino il riferimento da files.json
  removeFile(req.params.nome);

  res.status(200).type('text/plain').send("File eliminato con successo!");
}catch(e){
  res.status(400).type('text/plain').send("Errore durante l'eliminazione");
}
});
// ----------------------------------------------------------------------------------------------|


// Endpoint DELETE per rimuovere una misurazione tramite DATA e ORA -----------------------------|
app.delete('/delete/:data/:ora/:filename', (req, res) => {
  const dataParam = req.params.data;
  const oraParam = req.params.ora;

  fs.readFile(path.join(UPLOAD_PATH,req.params.filename), 'utf8', (err, fileData) => {
    if (err) {
      res.status(500).type('text/plain').send('Errore lettura file');
      return;
    }

    let dataSet = JSON.parse(fileData);

    // Rimuovi gli elementi con data e ora corrispondenti
    dataSet.dati = dataSet.dati.filter(el => !((el.data === dataParam) && (el.ora === oraParam)));

    fs.writeFile(path.join(UPLOAD_PATH,req.params.filename), JSON.stringify(dataSet, null, 2), (err) => {
      if (err) {
        res.status(500).type('text/plain').send('Errore salvataggio file');
        return;
      }
      res.status(200).type('text/plain').send('Elemento eliminato con successo');
    });
  });
});
// ----------------------------------------------------------------------------------------------|

// Endpoint PUT per modificare i valori
app.put('/edit/:data/:ora/:filename', (req,res)=>{
  
  fs.readFile(path.join(UPLOAD_PATH,req.params.filename),'utf8',(err,fileData)=>{
  if(err){
    res.status(500).type('text/plain').send('Errore lettura file');
    return;
  }

  // console.log("BODY:", req.body);
  // console.log("PARAMS:", req.params);
  // console.log(fileData);  

  let dataSet = JSON.parse(fileData);

  const entry = dataSet.dati.find(item => (item.data === req.params.data) && (item.ora === req.params.ora));
console.log("Misurazione da modificare :", entry);
    if (!entry) {
      res.status(404).type('text/plain').send('Misurazione non trovata');
      return;
    }
    else{
      // modifico i valori tramite il riferimento creato
      entry.co = req.body.co;
      entry.no2 = req.body.no2;
      entry.nox = req.body.nox;
      entry.o3 = req.body.o3;
      entry.pm10 = req.body.pm10;
    }

    fs.writeFile(path.join(UPLOAD_PATH,req.params.filename),JSON.stringify(dataSet,null,2),(err) => {

      if(err){
        res.status(500).type('text/plain').send('Errore in scrittura');
        return
      }
      else{
      res.status(200).type('text/plain').send('Modifica Effettuata!');
      }
    });
  });
});



app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}\n`);
});





















// esempi a lezione
  // Endpoint GET con parametro URL (route param)
  app.get('/doc/:nome', (req, res) => {
    if (req.params.nome)
      res.type('text/plain').send('Hello ' + req.params.nome);
    else 
      res.status(400).send('Nome non fornito');
  });

  // Endpoint GET con query parameter
  app.get('/doc', (req, res) => {
    if (req.query.nome)
      res.status(200).type('text/plain').send('Hello ' + req.query.nome);
    else 
      res.status(400).send('Nome non fornito');
  });

  // Endpoint POST con parametro nel body (richiesta JSON o form data)
  app.post('/doc/body/', (req, res) => {
    console.log("POST route body");
    res.status(200).type('text/plain').send('Hello ' + req.body.nome);
  });
