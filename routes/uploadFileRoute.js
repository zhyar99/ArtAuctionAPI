
const User = require('../Models/user'); // Assuming you've defined your user schema in 'User.js'
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "jksadhflajkshdflakjhsdflakjsdhfl";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post('/uploadimage/:id', upload.single('file'), async (req, res) => {

    const id = req.params.id;
    console.log(id);
    const profileImagePath = req.file.path;console.log(profileImagePath);
    await User.findByIdAndUpdate(id, { profile_image: profileImagePath },{ new: true }).maxTimeMS(30000);;
    
    res.status(200).json({ message: 'Profile image updated successfully' });


});

module.exports = router;