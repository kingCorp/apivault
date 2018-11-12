const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

//get all users
router.get('/', UserController.users_get_all);

//sign user up with unique email
router.post('/signup', UserController.user_signup);

//login users
router.post('/login', UserController.user_login);

//delete users
router.delete('/:userId',  UserController.user_delete)

//verify phone
router.post('/verify', UserController.verifyPhone)

module.exports = router;