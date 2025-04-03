/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.userLogin);
router.post('/register', userController.registerUser);
router.post('/verify', userController.verifyEmail);

// Admin routes with authentication and admin role check
router.put('/approve/:trainerId', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.approveTrainer);
router.get('/pending-trainers', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.getPendingTrainers);

module.exports = router;