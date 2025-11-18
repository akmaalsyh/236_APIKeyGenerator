const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definisikan route: POST ke /users akan menjalankan fungsi registerUser
router.post('/users', userController.registerUser);

module.exports = router;