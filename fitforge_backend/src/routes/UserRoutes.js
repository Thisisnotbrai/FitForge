/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/user-guard');

const userController = require('../controllers/UserController');

router.post('/login', userController.userLogin);
router.post('/register', userController.registerUser);


module.exports = router;