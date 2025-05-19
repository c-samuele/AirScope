function uploadHandler(req, res) {
  upload.single('csvfile')(req, res, (err) => {
    if (err) {
      console.error('Errore multer:', err);
      return res.status(500).send('Errore nel caricamento del file.');
    }
    if (!req.file) {
      console.warn('Nessun file caricato');
      return res.status(400).send('Nessun file caricato.');
    }

    console.log('File caricato:', req.file.originalname);

    const uploadedFilePath = req.file.path;

    fs.readFile(uploadedFilePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error('Errore lettura file:', readErr);
        return res.status(500).send('Errore nella lettura del file.');
      }

      console.log('Contenuto CSV:', data);

      const dbPath = path.join(__dirname, 'database.json');
      fs.readFile(dbPath, 'utf8', (dbReadErr, dbData) => {
        let jsonData = [];
        if (!dbReadErr) {
          try {
            jsonData = JSON.parse(dbData);
          } catch (parseErr) {
            console.warn('Errore parsing database.json:', parseErr);
            jsonData = [];
          }
        } else {
          console.log('database.json non trovato o vuoto, si creerà nuovo array');
        }

        console.log('Dati attuali database.json:', jsonData);

        jsonData.push({ filename: req.file.originalname, content: data });

        fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Errore scrittura database.json:', writeErr);
            return res.status(500).send('Errore nel salvataggio nel database.');
          }

          fs.unlink(uploadedFilePath, () => {});

          console.log('Salvataggio avvenuto con successo');
          res.send(`File ricevuto con successo: ${req.file.originalname}`);
        });
      });
    });
  });
}
