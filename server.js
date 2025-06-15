// CONFIGURAZIONE SERVER ---------------------------------------------------|
const express = require('express');    // Framework per creare server web
const multer = require('multer');      // Middleware per gestire il caricamento di file
const path = require('path');          // Utility per lavorare con percorsi di file e directory
const fs = require('fs');              // File System per lavorare con file e directory 
const csvParse = require('csv-parse'); // Per convertire csv in json

const app = express();                        // Crea un'app Express
const PORT = 3000;                            // Porta su cui il server ascolta

const DATA_PATH = './upload/dacaricare.json'; // PATH di salvataggio dati

app.use(express.static('public'));     // direttiva file statici

// Librerie statiche pubbliche ------------------------------------------------------------------|

// __dirname è il path relativo alla posizione del server.js variabile globale di node.js
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/chart', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Script --------------------------------------------------------------------|
const {normalizeDate,normalizeTime} = require('./utils/normalize.js');
const {readFilesList,addFileList} = require('./utils/filesAddAndRead.js');


// per inviare richieste con body json
app.use(express.json());


// CREO il file per la GESTIONE DEI FILES --------------------------------------|
const FILES_LIST_PATH = path.join(__dirname, 'upload', 'files.json'); // Percorso completo del file JSON che conterrà la lista dei file caricati

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
// END MULTER ------------------------------------------------------------------------|

// -------------------------------------------------------- ENDPOINT --------------------------------------------------------|
// REQUEST ---------------------------------------------------------------------------|

// Endpoint POST per il caricamento file
app.post('/upload', upload.single('file'), (req, res) => {

  // LOG DI DEBUG --------------------|
  console.log('req.body:', req.body);
  console.log('req.file:', req.file,"\n");
  // ---------------------------------|

  // Verifica contenuto
  if (!req.file) {
    return res.type('text/plain').status(404).send('Nessun file caricato!');
  }
  // SALVATAGGIO Informazioni form Upload
  const citta = req.body.citta;
  const ente = req.body.ente;
  const csvFilePath = req.file.path;

  // LOG DI DEBUG --------------------|
  console.log('Città:', citta);
  console.log('Ente:', ente);
  console.log('Percorso file:', csvFilePath + "\n");
  // ---------------------------------|

  const dati = [];     // variabile di salvataggio dati

  fs.createReadStream(csvFilePath)  // stream di lettura sul file csv    
    .pipe(  // Passa lo stream al parser
          csvParse.parse({  // Converto riga per riga in oggetto Js
                           columns: true,   // Indica che ci sono le chiavi nella prima riga
                           trim: true       // Rimuovo spazi iniziali/finali
                          }))
    // 'data' - Ad ogni nuovo chunk disponibile (oggetto completo)
    .on('data', (row) => { // row sarebbe il chunk ricevuto dall'evento 'data' dello stream appena parsato
        // normalizzo la data
        if (row.data) 
          row.data = normalizeDate(row.data);
        // normalizzo l'orario
        if (row.ora) 
          row.ora = normalizeTime(row.ora);
      // aggiungo all'array l'oggetto js normalizzato
      dati.push(row);
    })
    // 'end' - Alla fine dello stream (esauriti i chunk) 
    .on('end', () => {

      console.log("il primo oggetto:",dati.slice(0, 1), "\n"); // LOG di DEBUG -----------|

      const csvFileName = req.file.filename;                        // estrazione del nome file
      const jsonFileName = csvFileName.replace(/\.csv$/i, '.json'); // rinomino l'estensione del file

      console.log("csvNameFile: [",csvFileName ,"]\n"); // LOG di DEBUG -----------|
/* ------------------------------------------------------------------------------------------------------------------------*/
      // Oggetto da Salvare -------------------------|
      const outputObject = {
        citta: citta, 
        ente: ente,
        fileJson: jsonFileName,
        dati: dati
      };
      // --------------------------------------------|
      
      // Percorso di salvataggio file caricato
      const outputPath = path.join(__dirname, 'upload', jsonFileName);
      console.log("OutputPath:["+outputPath+"]");

      // Salvo come oggetto JSON
      fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), (err) => {
        if (err) {  // in caso di errore stampo la risposta catturata
          console.error('Errore nel salvataggio del file JSON:' + err); 
          return res.type('text/plain').status(500).send('Errore nel salvataggio del file JSON.');
        }

      // AGGINTA FILE A GESTORE DI FILES ------------------|
      // Creo l'obj del file corrente
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
        if (err) console.warn('Errore nella rimozione del file CSV: '+ err);
        else console.log('File CSV rimosso:', csvFilePath);
      });

        console.log('File JSON salvato:', outputPath);
        res.type('text/plain').status(200).send('File caricato e converito correttamente!');
      });
    }) // END 

    // Errore Del Parsing nello Stream
    .on('error', function(err) {
      console.error('Errore nel parsing: ' + err);
      res.type('text/plain').status(500).send('Errore nel parsing del CSV.');
    });

});

// Endpoint per aggiungere un nuovo elemento
app.post('/newItem', (req, res) => {
  
  const newItem = req.body;   // elemento da aggiungere
  console.log('Nuovo item ricevuto:', newItem);
  // Lettura db
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Errore lettura DB' });

    // converto in oggetto js
    const database = JSON.parse(data);

    database.dati.push(newItem); // aggiungo l'elemento 

    // scrivo le modifiche in json
    fs.writeFile(DATA_PATH, JSON.stringify(database, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Errore scrittura DB' });
      // risposta server sucess
      res.status(200).json({ message: 'Misurazione aggiunta con successo!' });
    });
  });
});

// END REQUEST ----------------------------------------------------------------------------------|


// Endpoint GET per leggere opendata da DATA_PATH ------------------------------------------------|
app.get('/upload/data', (req, res) => {

  // poichè sync è bloccante
  try{
    // Legge il contenuto del file come stringa 
    const data = fs.readFileSync(DATA_PATH);
    res.type('application/json').status(200).send(data);
  }catch(e){
    console.log("Errore lettura: " + e);
    res.type('text/plain').status(500).send("Errore nella lettura del file");
  }
});
// ----------------------------------------------------------------------------------------------|

// Endpoint GET leggere i files ------------------------------------------------|
app.get('/upload/files', (req,res) => {

  try{
    const files = fs.readFileSync('./upload/files.json', 'utf8');
    res.type('application/json').status(200).send(files);
  }catch(e){
    console.log("Errore lettura: " + e);
    res.type('text/plain').status(500).send("Errore nella lettura del gestore files");
  }

});

app.delete('/deletefiles/:nome',(req,res) => {
  try{
  let files = readFilesList();
  
  }catch(e){

  }

});



// Endpoint DELETE per rimuovere una misurazione tramite DATA e ORA -----------------------------|
app.delete('/delete/:data/:ora', (req, res) => {
  const dataParam = req.params.data;
  const oraParam = req.params.ora;

  fs.readFile(DATA_PATH, 'utf8', (err, fileData) => {
    if (err) {
      res.status(500).type('text/plain').send('Errore apertura file');
      return;
    }

    let dataSet = JSON.parse(fileData);

    // Rimuovi gli elementi con data e ora corrispondenti
    dataSet.dati = dataSet.dati.filter(el => !(el.data === dataParam && el.ora === oraParam));

    fs.writeFile(DATA_PATH, JSON.stringify(dataSet, null, 2), (err) => {
      if (err) {
        res.status(500).type('text/plain').send('Errore salvataggio file');
        return;
      }
      res.status(200).type('text/plain').send('Elemento eliminato con successo');
    });
  });
});
// ----------------------------------------------------------------------------------------------|


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
