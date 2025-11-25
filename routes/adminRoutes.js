const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminMiddleware'); // Import Middleware

// Route Login (Terbuka untuk umum agar admin bisa masuk)
router.post('/admin/login', adminController.loginAdmin);

// Route Create Admin (Mungkin mau dilindungi juga nanti, tapi biarkan dulu)
router.post('/admin/register', adminController.createAdmin);

// Route Revoke Key (SEKARANG DILINDUNGI adminAuth)
router.put('/admin/revoke-key', adminAuth, adminController.revokeKey);

// ... import lainnya

// Get Data Lists (Protected by Token)
router.get('/admin/users', adminAuth, adminController.getAllUsers);
router.get('/admin/keys', adminAuth, adminController.getAllApiKeys);

module.exports = router;