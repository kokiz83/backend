const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: false },
    description: { type: String, required: false },
    mainPepper: { type: String, required: false },
    imageUrl: { type: String, required: false },
    heat: { type: Number, required: false },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }

})

module.exports = mongoose.model("sauce", sauceSchema)  