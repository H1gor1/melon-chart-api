const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote cors
const Melon = require('./index');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar o corpo da solicitação como JSON
app.use(bodyParser.json());

// Middleware para lidar com o CORS
app.use(cors());

// Rota para obter o chart em tempo real
app.get('/api/melon/realtime', (req, res) => {
  const melon = new Melon(null, { cutLine: 100 });
  melon.realtime().then(data => res.json(data)).catch(err => res.status(500).json({ error: err.message }));
});

// Rota para obter o chart diário
app.get('/api/melon/daily', (req, res) => {
  const melon = new Melon(null, { cutLine: 100 });
  melon.daily().then(data => res.json(data)).catch(err => res.status(500).json({ error: err.message }));
});

// Rota para obter o chart semanal
app.get('/api/melon/weekly', (req, res) => {
  const melon = new Melon(null, { cutLine: 100 });
  melon.weekly().then(data => res.json(data)).catch(err => res.status(500).json({ error: err.message }));
});

// Rota para obter o chart mensal
app.get('/api/melon/monthly', (req, res) => {
  const melon = new Melon(null, { cutLine: 100 });
  melon.monthly().then(data => res.json(data)).catch(err => res.status(500).json({ error: err.message }));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
