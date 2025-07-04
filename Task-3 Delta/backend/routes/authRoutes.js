const router = require('express').Router();
const { register, login, logout, forgotPassword,changePassword, resetPassword} = require('../controllers/authcontroller');
router.post('/register', register);
router.post('/login', login);  
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password',changePassword);
module.exports = router;