const path = require('path');
const express = require('express');
const multer = require('multer');

const app = express();
const PORT = 3000;

// per inviare richieste con body json
app.use(express.json());

// definisco la root dei file statici
app.use(express.static('public')); // HTML/CSS/JS personalizzati
// bootstrap
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); 

// salvataggio file
const storage = multer.diskStorage({
  // Definisco la cartella dove salvare i file caricati
  destination: function (req, file, cb) {
    // cb(null, 'upload/') nessun errore (null) e salva in 'upload/'
    cb(null, 'upload/');
  },
  // Funzione che definisce il nome con cui salvare il file
  filename: function (req, file, cb) {
    // cb(null, file.originalname) significa: nessun errore e usa il nome originale del file
    cb(null, file.originalname);
  }
});

// Creo l'oggetto multer con la configurazione storage sopra
const upload = multer({ storage: storage });

////////////////////////////////////
//      *****  ****  **** *****   //
//      *    * *  * *       *     //
//      *****  *  *  ***    *     //  
//      *      *  *     *   *     //
//      *      ****  ****   *     //
////////////////////////////////////
// Route POST per ricevere il file caricato
app.post('/upload', upload.single('file'), (req, res) => {
  // req.file contiene tutte le info del file caricato e salvato
  // console.log(req.file);

  // Rispondo al client che il file è stato salvato
  res.send('File salvato sul server!');
});


// endpoint GET
app.get('/public/assets', (req, res) => {
  res.send('Server attivo!');
});


app.listen(3000, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});

