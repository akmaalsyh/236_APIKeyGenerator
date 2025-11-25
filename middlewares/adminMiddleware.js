require('dotenv').config(); // <--- 1. PENTING: Panggil ini agar bisa baca .env
const jwt = require('jsonwebtoken');

// 2. Ambil rahasia dari .env (SAMA PERSIS dengan Controller)
const JWT_SECRET = process.env.JWT_SECRET; 

const adminAuth = (req, res, next) => {
  // Ambil token dari header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil tokennya saja

  if (!token) {
    return res.status(401).json({ error: 'Akses Ditolak: Butuh token admin' });
  }

  try {
    // 3. Verifikasi token menggunakan JWT_SECRET dari .env
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified; // Simpan data admin ke request
    next(); // Lanjut masuk
  } catch (error) {
    console.log("GAGAL VERIFIKASI TOKEN:", error.message);
    
    // Debugging (Opsional): Cek di terminal apakah secret terbaca
    if(!JWT_SECRET) console.log("BAHAYA: JWT_SECRET di .env belum terbaca!");

    res.status(403).json({ error: 'Token tidak valid atau Sesi habis' });
  }
};

module.exports = adminAuth;