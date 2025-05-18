const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server attivo!');
});

app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
