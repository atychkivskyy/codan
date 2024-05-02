const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate, isAdmin} = require('../middlewares/auth');

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.patch('/users/:id', authenticate, isAdmin, userController.updateUser);
router.delete('/users/:id', authenticate, isAdmin, userController.deleteUser);
router.get('/', )

module.exports = router;
