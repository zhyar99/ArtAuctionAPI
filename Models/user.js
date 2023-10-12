const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    user_type: {
        type: String,
        enum: ["artist", "bidder"],
        required: true
    },
    profile_image: {
        type: String, // You can store the image URL or file path
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
