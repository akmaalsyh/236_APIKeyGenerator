const { User, ApiKey } = require('../models'); // Impor model

// Fungsi untuk mendaftarkan user baru
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // 1. Buat User baru
    const newUser = await User.create({
      firstName,
      lastName,
      email,
    });

    // 2. Langsung buatkan ApiKey pertama untuk user tsb
    const newApiKey = await ApiKey.create({
      userId: newUser.id,
      // 'key' akan terisi otomatis (default UUIDv4)
      // 'status' akan terisi otomatis (default 'active')
    });

    // 3. Kembalikan data user DAN key-nya
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        email: newUser.email,
      },
      apiKey: newApiKey.key, // Tampilkan key ini ke user HANYA SEKALI
    });

  } catch (error) {
    // Tangani error jika email sudah ada, dll.
    res.status(500).json({ error: 'Failed to register user.', details: error.message });
  }
};