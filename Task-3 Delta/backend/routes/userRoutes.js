const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteAccount , changePassword} = require('../controllers/usercontroller');
const { protect } = require('../middleware/auth');
const upload=require('../middleware/upload');

router.get('/profile', protect, getProfile);

// router.put('/updateprofile', protect,updateProfile);
router.put('/updateprofile', protect,upload.single('avatar'), updateProfile);

router.put('/change-password',protect, changePassword);

router.delete('/deleteaccount', protect, deleteAccount);

module.exports = router;
