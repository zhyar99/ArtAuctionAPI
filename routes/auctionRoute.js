const express = require('express');
const router = express.Router();
const Auction = require('../Models/auction'); // Assuming you've defined your schema in 'Auction.js'


// Fetch all auctions
router.get('/', async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new auction
router.post('/', async (req, res) => {
    try {
        const newAuction = new Auction(req.body); // req.body should contain auction data
        const savedAuction = await newAuction.save();
        res.status(201).json(savedAuction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read auction by ID
router.get('/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update auction by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAuction = await Auction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAuction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(updatedAuction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete auction by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAuction = await Auction.findByIdAndRemove(req.params.id);
        if (!deletedAuction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json({ message: 'Auction deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
