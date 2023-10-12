const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    
    artworkId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the artist's User document
        ref: 'Artwork', // Reference to the User model
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentHighestBid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
    },
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
