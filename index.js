const express = require('express');
const app = express();
const port = 3000;

// Impor routes Anda
const userRoutes = require('./routes/userRoutes');

// Middleware untuk membaca JSON dari body request
app.use(express.json());

// Gunakan routes yang sudah Anda buat
app.use('/api', userRoutes); // Semua rute user akan diawali /api

app.get('/', (req, res) => {
  res.send('API Server is running!');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});