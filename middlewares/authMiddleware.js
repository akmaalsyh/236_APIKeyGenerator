const { ApiKey, User } = require('../models');

const apiKeyAuth = async (req, res, next) => {
  // 1. Ambil key dari Header (biasanya bernama 'x-api-key')
  const key = req.headers['x-api-key'];

  if (!key) {
    return res.status(401).json({ 
      error: 'Akses Ditolak', 
      message: 'API Key tidak ditemukan di header (x-api-key)' 
    });
  }

  try {
    // 2. Cek apakah Key ada di database dan statusnya 'active'
    const apiKeyRecord = await ApiKey.findOne({
      where: { key: key, status: 'active' },
      include: [
        { model: User, as: 'user' } // Sertakan data pemilik key
      ]
    });

    if (!apiKeyRecord) {
      return res.status(403).json({ 
        error: 'Akses Ditolak', 
        message: 'API Key tidak valid atau sudah tidak aktif' 
      });
    }

    // 3. Simpan data user ke dalam request (agar bisa dipakai di controller nanti)
    req.user = apiKeyRecord.user;
    req.apiKey = apiKeyRecord;

    // 4. Lanjut ke proses berikutnya
    next(); 

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan server saat validasi key' });
  }
};

module.exports = apiKeyAuth;