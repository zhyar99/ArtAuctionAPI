const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the auction document
        ref: 'Auction', // Reference to the Auction model
        required: true,
    },
    bidder_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the bidder's User document
        ref: 'User', // Reference to the User model
        required: true,
    },
    bid_amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
