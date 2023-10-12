const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {User} = require('../Models/person');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "jksadhflajkshdflakjhsdflakjsdhfl";

router.get('/', async (req, res) => {
    try{
        const users = await User.find();

        res.json(users);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/profile', (req, res) => {
    const token = req.cookies['token'];
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const user = await User.findById(userData.id);
            res.json(user);
        })
    }else{
        res.json('null')
    }
});

router.get('/:id', async (req, res) => {
    try{
        const{id} = req.params;
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({error: 'user not found'});
        }
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/', async (req, res) => {
    try{
        const user = req.body;
        user.password = bcrypt.hashSync(user.password, bcryptSalt);
        console.log(user.password);
        console.log(user);
        const newUser = new User(user);
        
        await newUser.save();
        res.json(newUser);

    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try{
        const {id} = req.params;

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        user.set(req.body);
        await user.save();

        res.json(user);

    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const {id} = req.params;

        const user = await User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        res.json(user);

    }catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json(true);
            });
        }else{
            res.status(422).json('pass not ok');
        }
    }else{
        res.json('not found');
    }
});


router.get('/profile', (req, res) => {
    const token = req.cookies['token'];
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const user = await User.findById(userData.id);
            res.json(user._id);
        })
    }else{
        res.json(null)
    }
});

router.post('/logout', (req, res) =>{
    try{
        res.cookie('token', '').json(true);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});


module.exports = router;