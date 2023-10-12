const express = require('express');
const router = express.Router();
const Artwork = require('../Models/artwork');
const Artist = require('../Models/artist'); // Assuming you've defined your schema in 'Artwork.js'
const multer = require('multer');
const mongoose = require('mongoose');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('artwork_image') ,async (req, res) => {
    try {
        const { title, description, artist_id,starting_bid, startTime, endTime } = req.body;
        const profileImagePath = req.file.path
        const currentHighestBid = starting_bid;
        const newArtwork = new Artwork({
          title,
          description,
          artist_id,
          starting_bid,
          startTime,
          currentHighestBid,
          endTime,
          artwork_image: profileImagePath, // Store the file name in the database
        });
        await newArtwork.save();
        res.json(newArtwork);
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Fetch all artworks
router.get('/', async (req, res) => {
    try {
        const artworks = await Artwork.find();

        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/by-artist/:artist_id', async (req, res) => {
    try {
        const artistId = req.params.artist_id;
        const artworks = await Artwork.find({ artist_id: artistId });
        if (!artworks) {
            return res.status(404).json({ message: 'No artworks found for this artist' });
        }
        console.log(artworks);
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/by-bidder/:last_bidder', async (req, res) => {
    try {
        const last_bidder = req.params.last_bidder;
        const artworks = await Artwork.find({ last_bidder: last_bidder });
        if (!artworks) {
            return res.status(404).json({ message: 'No artworks found for this artist' });
        }
        console.log(artworks);
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Create a new artwork

// Read artwork by ID
router.get('/:id', async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.json(artwork);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update artwork by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedArtwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedArtwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.json(updatedArtwork);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete artwork by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedArtwork = await Artwork.findByIdAndRemove(req.params.id);
        if (!deletedArtwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }
        res.json({ message: 'Artwork deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;