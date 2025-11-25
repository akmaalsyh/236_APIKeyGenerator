const jwt = require('jsonwebtoken');
const JWT_SECRET = 'rahasia_negara_api_2025'; // Harus sama dengan yang di controller

const adminAuth = (req, res, next) => {
  // Ambil token dari header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil bagian tokennya saja

  if (!token) {
    return res.status(401).json({ error: 'Akses Ditolak: Butuh token admin' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified; // Simpan data admin
    next(); // Lanjut boleh masuk
  } catch (error) {
    res.status(403).json({ error: 'Token tidak valid' });
  }
};

module.exports = adminAuth;