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


  const records = [];
  fs.createReadStream(csvFilePath)
    // columns: true <- prima riga legenda.
    .pipe(csvParse.parse({ columns: true, trim: true }))
    .on('data', function(row) {
      records.push(row);
    })
    .on('end', function() {
      console.log('CSV trasformato in oggetti:');
      console.log(records.slice(0, 2));

      const csvFileName = req.file.filename;
      const jsonFileName = csvFileName.replace(/\.csv$/i, '.json');

      const outputObject = {
        citta: citta,
        ente: ente,
        data_caricamento: new Date().toISOString(),
        fileJson: jsonFileName,
        dati: records
      };

      const outputPath = path.join(__dirname, 'upload', jsonFileName);

      fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), (err) => {
        if (err) {
          console.error('Errore nel salvataggio JSON:', err);
          return res.status(500).send('Errore nel salvataggio del JSON.');
        }
        console.log('File JSON salvato:', outputPath);
        res.send('File JSON creato correttamente!');
      });
    })
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
// Avg Value
app.get('/api/values_avg', (req, res) => {
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

app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

