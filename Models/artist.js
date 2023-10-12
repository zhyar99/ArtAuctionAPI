const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  social_media: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    // Add other social media fields as needed
  },
  // Add other contact details fields as needed
});

const artistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the artist's User document
    ref: 'User', // Reference to the User model
    unique: true,
    required: true,
  },
  bio: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  business_email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
});
const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
