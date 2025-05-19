const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

// Serve i file dentro la cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Server attivo!');
});

app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
