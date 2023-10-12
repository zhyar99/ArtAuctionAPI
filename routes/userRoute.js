const User = require('../Models/user'); // Assuming you've defined your user schema in 'User.js'
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "jksadhflajkshdflakjhsdflakjsdhfl";


router.get('/profile', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://6527ae6249182411efcdbd86--chic-pie-348ac1.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const token = req.cookies['token'];
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            console.log("userData", userData);
            if(err) throw err;
            const user = await User.findById(userData.id);
            res.json(user);
        });
    }else{
        res.json(null)
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const user = req.body;
        user.password = bcrypt.hashSync(user.password, bcryptSalt);
        user.email = user.email.toString().toLowerCase();
        const newUser = new User(user);
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://6527ae6249182411efcdbd86--chic-pie-348ac1.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    try {
        const { email, password } = req.body;
        const userDoc = await User.findOne({ email });

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign(
                { email: userDoc.email, user_type: userDoc.user_type, username: userDoc.username, id: userDoc._id },
                jwtSecret,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(true);
                }
            );
        } else {
            res.status(422).json('Password not correct');
        }
    } catch (err) {
        console.error('Error:', err);
        if (err instanceof mongoose.Error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(400).json({ error: err.message });
    }
});



router.post('/logout', (req, res) =>{
    try{
        res.cookie('token', '').json(true);
        console.log("triggered");
    }catch(err){
        res.status(500).json({error: err.message});
    }
});


module.exports = router;
