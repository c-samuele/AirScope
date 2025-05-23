// CONFIGURAZIONE SERVER ---------------------------------------------------|
const express = require('express');    // Framework per creare server web
const multer = require('multer');      // Middleware per gestire il caricamento di file
const path = require('path');          // Utility per lavorare con percorsi di file e directory
const fs = require('fs');             // File System per lavorare con file e directory 

const app = express();                 // Crea un'app Express
const PORT = 3000;             // Porta su cui il server ascolta

app.use('/jquery', express.static('node_modules/jquery/dist'));

// per inviare richieste con body json
app.use(express.json());

// direttiva file statici
app.use(express.static('public'));
// direttiva bootstrap
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); 


// MULTER CARICAMENTO FILE ----------------------------------------------------|
// salvataggio file
const storage = multer.diskStorage({
  // Definisco la cartella dove salvare i file caricati
  destination: function (req, file, cb) {
    // cb(null, 'upload/') nessun errore (null) e salva in 'upload/'
    cb(null, 'upload/');
  },

  // Nome di salvataggio file
  filename: function (req, file, cb) {
    // cb(null, file.originalname) significa: nessun errore e usa il nome originale del file
    cb(null, file.originalname);
  }
});

// Creo l'oggetto multer con la configurazione storage 
const upload = multer({ storage: storage });

// END MULTER -----------------------------------------------------------------|


////////////////////////////////////
///           REQUEST            ///  
////////////////////////////////////

// Route POST per ricevere i file caricati
app.post('/upload', upload.single('file'), (req, res) => {
  // req.file contiene tutte le info del file caricato e salvato
  console.log(req.file);

  // Rispondo al client che il file è stato salvato
  res.send('File salvato sul server!');
});

////////////////////////////////////
///           DASHBOARD          ///  
////////////////////////////////////




// --------------------------
// endpoint GET con query string
app.get('/doc', (req, res) => {
  if(req.query.nome)
    res.type('text/plain').send('Hello '+req.query.nome); 
  else{
    res.status(400);
    res.send('Nome non fornito');
  }
});

// endpoint GET con parametri :name è il placeholder del parametro
app.get('/doc/:nome', (req, res) => {
  if(req.params.nome)
    res.type('text/plain').send('Hello '+req.params.nome); 
  else{
    res.status(400);
    res.send('Nome non fornito');
  }

});

app.post('/doc/body/', (req, res) => {
  console.log("POST route body");
  res.type('text/plain').send('Hello '+req.body.nome);  
});
// ---------------------


// Risposta alla chiamata GET asincrona per i valori medi
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


////////////////////////////////////
//            ANALISI             //  
////////////////////////////////////



app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

