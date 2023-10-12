const express = require('express');
const router = express.Router();
const Bid = require('../Models/bid'); // Assuming you've defined your schema in 'Bid.js'

// Fetch all bids
router.get('/', async (req, res) => {
    try {
        const bids = await Bid.find();
        res.json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new bid
router.post('/', async (req, res) => {
    try {
        const newBid = new Bid(req.body); // req.body should contain bid data
        const savedBid = await newBid.save();
        res.status(201).json(savedBid);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read bid by ID
router.get('/:id', async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.json(bid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update bid by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedBid = await Bid.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.json(updatedBid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete bid by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBid = await Bid.findByIdAndRemove(req.params.id);
        if (!deletedBid) {
            return res.status(404).json({ message: 'Bid not found' });
        }
        res.json({ message: 'Bid deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





module.exports = router;
