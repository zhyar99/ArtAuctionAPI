const express = require('express');
const Artist = require('../Models/artist');
const User = require('../Models/user');
const router = express.Router(); // Assuming you've defined your schema in 'ContactDetails.js'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "jksadhflajkshdflakjhsdflakjsdhfl";
// Create a new artist
router.post('/', async (req, res) => {
    try {
      
        const newArtist = new Artist(req.body); // req.body should contain artist data
        console.log(newArtist);
        const savedArtist = await newArtist.save();
        console.log(savedArtist.user_id);
        const updatedUser = await User.findByIdAndUpdate(savedArtist.user_id, { user_type: 'artist' }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json(savedArtist);
    } catch (err) {
      console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});



// Read artist by ID
  router.get('/:id', async (req, res) => {
    try {
        console.log("accessed");
        const artist = await Artist.findById(req.params.id)
        .populate({
            path: 'user_id',
            model: 'User',
            select: 'user_id username profile_image' // Add other fields you want to retrieve
        });
        
        res.json(artist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  });

  // Read artist by ID
router.get('/user/:id', async (req, res) => {
    try {
        console.log(req.params.id );
        const artist = await Artist.find({ user_id: req.params.id });
        console.log(artist);
        res.json(artist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  })
// Fetch all artists
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  });
  
  
  
  
  // Update artist by ID
  router.put('/:id', async (req, res) => {
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json(updatedArtist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  });
  
  // Delete artist by ID
  router.delete('/:id', async (req, res) => {
    try {
        const deletedArtist = await Artist.findByIdAndRemove(req.params.id);
        if (!deletedArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.json({ message: 'Artist deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  });
  


module.exports = router;
