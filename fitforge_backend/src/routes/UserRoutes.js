/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/login', userController.userLogin);
router.post('/register', userController.registerUser);
router.post('/verify', userController.verifyEmail);


module.exports = router;