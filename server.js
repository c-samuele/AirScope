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

// Framework ------------------------------------------------------------------|

// __dirname è il path relativo alla posizione del server.js variabile globale di node.js
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/chart', express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Script -----------------------------------------------------------------|
const { normalizeDate, normalizeTime } = require('./utils/normalize.js');

// per inviare richieste con body json
app.use(express.json());


// MULTER CARICAMENTO FILE ----------------------------------------------------|
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
// END MULTER -----------------------------------------------------------------|


// REQUEST --------------------------------------------------------------------|
// Endpoint POST per il caricamento file
app.post('/upload', upload.single('file'), (req, res) => {

  // LOG DI DEBUG --------------------|
  // console.log('req.body:', req.body);
  // console.log('req.file:', req.file);
  // ---------------------------------|

  // VERIFICA DEL CARICAMENTO
  if (!req.file) {
    return res.type('text/plain').status(400).send('Nessun file caricato!');
  }
  // SALVATAGGIO Informazioni form Upload
  const citta = req.body.citta;
  const ente = req.body.ente;
  const csvFilePath = req.file.path;

  // LOG DI DEBUG --------------------|
  // console.log('Città:', citta);
  // console.log('Ente:', ente);
  // console.log('Percorso file:', csvFilePath);
  // ---------------------------------|

  const data = [];     // variabile di salvataggio oggetti convertiti
  fs.createReadStream(csvFilePath)  // stream di lettura sul file csv
    // Converto in oggetto Js
    .pipe(csvParse.parse({ columns: true, trim: true }))    // columns:prima riga ignorata(legenda). trim:rimuove spazi iniziali/finali
    // itero sugli eventi 'data' dati dallo stream del parse
    .on('data', function(row) {     // per ogni riga del csv 
        // normalizzo la data
        if (row.data) 
          row.data = normalizeDate(row.data);
        // normalizzo l'orario
        if (row.ora) 
          row.ora = normalizeTime(row.ora);
      // aggiungo la data
      data.push(row);
    })
    .on('end', function() {         // al termine dello stream
      //LOG di DEBUG --------------------------------|
      // console.log('CSV trasformato in oggetti:');
      // console.log(data.slice(0, 2)); 
      // --------------------------------------------|
      const csvFileName = req.file.filename;                        // estrazione del nome file
      const jsonFileName = csvFileName.replace(/\.csv$/i, '.json'); // rinomino l'estensione del file

      // Oggetto da Salvare -------------------------|
      const outputObject = {
        citta: citta, 
        ente: ente,
        data_caricamento: new Date().toISOString(),
        fileJson: jsonFileName,
        dati: data
      };
      // --------------------------------------------|
      
      // Percorso di salvataggio file caricato
      const outputPath = path.join(__dirname, 'upload', jsonFileName);
      console.log("[outputPath:"+outputPath+"]");

      // Salvo come oggetto JSON
      fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), (err) => {
        if (err) {  // in caso di errore stampo la risposta catturata
          console.error('Errore nel salvataggio del file JSON:', err); 
          return res.type('text/plain').status(500).send('Errore nel salvataggio del file JSON.');
        }
      // cancello il .csv da /Update
      fs.unlink(csvFilePath, (err) => {
        if (err) console.warn('Errore nella rimozione del file CSV:', err);
        else console.log('File CSV rimosso:', csvFilePath);
      });

        console.log('File JSON salvato:', outputPath);
        res.type('text/plain').status(200).send('File JSON creato correttamente!');
      });
    }) // END STREAM

    // Errore Del Parsing nello Stream
    .on('error', function(err) {
      console.error('Errore nel parsing:', err);
      res.status(500).send('Errore nel parsing del CSV.');
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
      res.status(200).json({ message: 'Dato aggiunto con successo!' });
    });
  });
});



// END REQUEST ------------------------------------------------------------------|

// DASHBOARD --------------------------------------------------------------------|
// Data AVG
app.get('/avgMetrics', (req, res) => {
  fs.readFile('./upload/database.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Errore nel leggere il file' });
      return;
    }
    const valori = JSON.parse(data);
    res.json(valori);
  });
});

// END DASHBOARD ----------------------------------------------------------------|

// ANALISI --------------------------------------------------------------------|

// Endpoint GET leggere i dati (TABELLA & GRAFICO)
app.get('/upload/data', (req, res) => {

  // poichè sync è bloccante
  try{
    // Legge il contenuto del file come stringa 
    const data = fs.readFileSync(DATA_PATH);
    res.type('application/json').status(200).send(data); // converto la stringa letta in oggetto Json
  }catch(error){
    console.log("Errore lettura: "+ error);
    res.type('text/plain').status(500).send("Errore nella lettura del file");
  }
});

// END ANALISI ----------------------------------------------------------------|


app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});



// esempi a lezione
  // Endpoint GET con parametro URL (route param)
  app.get('/doc/:nome', (req, res) => {
    if (req.params.nome)
      res.type('text/plain').send('Hello ' + req.params.nome);
    else {
      res.status(400);
      res.send('Nome non fornito');
    }
  });

  // Endpoint GET con query parameter
  app.get('/doc', (req, res) => {
    if (req.query.nome)
      res.type('text/plain').send('Hello ' + req.query.nome);
    else {
      res.status(400);
      res.send('Nome non fornito');
    }
  });

  // Endpoint POST con parametro nel body (richiesta JSON o form data)
  app.post('/doc/body/', (req, res) => {
    console.log("POST route body");
    res.type('text/plain').send('Hello ' + req.body.nome);
  });
