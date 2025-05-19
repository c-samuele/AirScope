const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware per il parsing JSON e form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servire Bootstrap statico
app.use('/bootstrap', express.static(path.join(__dirname, 'assets/bootstrap/dist')));

// Servire assets statici
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Servire file statici dalla root (per esempio service.html)
app.use(express.static(__dirname));

// Endpoint root con scritta bootstrap
app.get('/', (req, res) => {
  res.send(`
    <h1>Bootstrap funziona!</h1>
    <p>Invia un file CSV tramite <a href="/service.html">service.html</a></p>
  `);
});

// Endpoint per pagina upload
app.get('/service.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'service.html'));
});

// Setup multer per upload file nella cartella uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint POST per upload CSV
app.post('/upload', upload.single('csvfile'), (req, res) => {
  if (!req.file) return res.status(400).send('Nessun file caricato');

  const uploadedFilePath = req.file.path;
  const dbPath = path.join(__dirname, 'database.json');

  fs.readFile(uploadedFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Errore nella lettura del file.');

    fs.readFile(dbPath, 'utf8', (dbErr, dbData) => {
      let jsonData = [];
      if (!dbErr) {
        try { jsonData = JSON.parse(dbData); } 
        catch { jsonData = []; }
      }

      jsonData.push({ filename: req.file.originalname, content: data });

      fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        fs.unlink(uploadedFilePath, () => {});

        if (writeErr) return res.status(500).send('Errore nel salvataggio nel database.');

        res.send(`File ricevuto con successo e salvato: ${req.file.originalname}`);
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
