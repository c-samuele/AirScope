// CONFIGURAZIONE SERVER ---------------------------------------------------|
const express = require('express');    // Framework per creare server web
const multer = require('multer');      // Middleware per gestire il caricamento di file
const path = require('path');          // Utility per lavorare con percorsi di file e directory
const fs = require('fs');              // File System per lavorare con file e directory 
const csvParse = require('csv-parse'); // Per convertire csv in json

const app = express();                 // Crea un'app Express
const PORT = 3000;                     // Porta su cui il server ascolta

app.use(express.static('public'));     // direttiva file statici

// Framework ----------------------------------------------------------------|
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/chart', express.static('node_modules/chart.js/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); 
app.use('/upload', express.static(path.join(__dirname, 'upload')));

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
// Route POST per ricevere i file caricati
app.post('/upload', upload.single('file'), (req, res) => {

  // LOG DI DEBUG --------------------|
  // console.log('req.body:', req.body);
  // console.log('req.file:', req.file);
  // ---------------------------------|
  if (!req.file) {
    return res.status(400).send('Nessun file caricato!');
  }
  // dati da analizzare
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
    .pipe(csvParse.parse({ columns: true, trim: true }))    // columns:prima riga ignorata(legenda). trim:rimuove spazi iniziali/finali
    .on('data', function(row) {     // per ogni riga del csv 
      data.push(row);            // aggiungo a data la riga 
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

      // Salvo come oggetto JSON con 2 spazi
      fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), (err) => {
        if (err) {  // in caso di errore stampo la risposta catturata
          console.error('Errore nel salvataggio del file JSON:', err); 
          return res.status(500).send('Errore nel salvataggio del file JSON.');
        }
      // cancello il .csv da /Update
      fs.unlink(csvFilePath, (err) => {
        if (err) console.warn('Errore nella rimozione del file CSV:', err);
        else console.log('File CSV rimosso:', csvFilePath);
      });

        console.log('File JSON salvato:', outputPath);
        res.send('File JSON creato correttamente!');
      });
    }) // END STREAM

    // Errore Del Parsing nello Stream
    .on('error', function(err) {
      console.error('Errore nel parsing:', err);
      res.status(500).send('Errore nel parsing del CSV.');
    });
});




// END REQUEST ------------------------------------------------------------------|
    
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


// DASHBOARD --------------------------------------------------------------------|
// Data AVG
app.get('/api/data_avg', (req, res) => {
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
// Endpoint GET per il chart
app.get('/upload/data_chart', (req, res) => {

  // poichè sync è bloccante
  try{
    // Legge il contenuto del file come stringa 
    const data = fs.readFileSync('./upload/dacaricare.json');
    res.type('application/json').status(200).send(data); // converto la stringa letta in oggetto Json
  }catch(e){
    console.log("Errore lettura: "+ e);
    res.type('text/plain').status(500).send("Errore nella lettura del file");
  }
});

// END ANALISI ----------------------------------------------------------------|


app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

