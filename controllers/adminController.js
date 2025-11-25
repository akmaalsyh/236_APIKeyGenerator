require('dotenv').config(); // Load .env
const { Admin, ApiKey, User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Tambah ini di paling atas
const JWT_SECRET = process.env.JWT_SECRET;

// 1. Buat Admin Baru (Untuk setup awal saja)
exports.createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      passwordHash: hashedPassword
    });

    res.json({ message: 'Admin created', adminId: newAdmin.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Fungsi Admin Mematikan Key (Revoke)
exports.revokeKey = async (req, res) => {
  try {
    const { targetApiKey } = req.body; // Key yang ingin dimatikan

    // Cari Key di database
    const keyRecord = await ApiKey.findOne({ where: { key: targetApiKey } });

    if (!keyRecord) {
      return res.status(404).json({ error: 'API Key tidak ditemukan' });
    }

    // Ubah status menjadi 'revoked'
    keyRecord.status = 'revoked';
    await keyRecord.save();

    res.json({ 
      message: `API Key berhasil dimatikan (revoked).`, 
      key: targetApiKey,
      status: 'revoked'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Login Admin dan Dapatkan Token
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari admin berdasarkan email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Cek password (Bandingkan input dengan hash di DB)
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Buat Token (Tiket Masuk)
    const token = jwt.sign(
      { id: admin.id, role: 'admin' }, // Data yang disimpan di token
      JWT_SECRET,
      { expiresIn: '1h' } // Token kadaluwarsa dalam 1 jam
    );

    res.json({
      message: 'Login berhasil',
      token: token // Admin harus menyimpan token ini
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... (kode createAdmin, revokeKey, loginAdmin yang sudah ada)

// 4. GET All Users (Hanya Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. GET All API Keys (Hanya Admin)
exports.getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({
      include: [{ model: User, as: 'user' }] // Join dengan tabel User
    });
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};