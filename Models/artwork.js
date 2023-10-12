const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({ 
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  artwork_image: {
      type: String, // You can store the image URL or file path
  },
  artist_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the artist's User document
    ref: 'Artist', // Reference to the User model
    required: true,
  },
  starting_bid: {
    type: Number,
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
  currentHighestBid: {
    type: Number,
    required: true,
  },
  last_bidder: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the artist's User document
    ref: 'User', // Reference to the User model
  },
  // Add other artwork-specific attributes here as needed
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;