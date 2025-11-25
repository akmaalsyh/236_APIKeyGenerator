const express = require('express');
const app = express();
const port = 3000;
const path = require('path'); // 1. Tambahkan ini (bawaan Node.js)

const cors = require('cors');
// ... import routes lainnya

app.use(cors());
app.use(express.json());

// 2. Tambahkan baris ini (Middleware untuk Folder Public)
app.use(express.static(path.join(__dirname, 'public')));

// ... kode routes (app.use('/api', ...))

// 3. (Opsional tapi bagus) Paksa root URL ke index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

const userRoutes = require('./routes/userRoutes');
const apiKeyAuth = require('./middlewares/authMiddleware'); // <--- Import Satpam tadi
// ... import lainnya
const adminRoutes = require('./routes/adminRoutes'); // <--- Tambah ini



app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', adminRoutes); // <--- Tambah ini
// ... sisa kode lainnya


// --- AREA TERPROTEKSI ---
// Route ini dipasang middleware 'apiKeyAuth'
app.get('/api/protected-data', apiKeyAuth, (req, res) => {
  // Karena sudah lolos middleware, kita bisa akses req.user
  res.json({
    message: 'Selamat! Anda berhasil masuk ke area rahasia.',
    yourData: {
      id: req.user.id,
      name: req.user.firstName,
      email: req.user.email
    }
  });
});
// ------------------------

app.get('/', (req, res) => {
  res.send('API Server is running!');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});