const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('public')); // HTML/CSS/JS personalizzati
app.use('/bootstrap', express.static('node_modules/bootstrap/dist')); //Bootstrap

app.get('/', (req, res) => {
  res.send('Server attivo!');
});

app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
