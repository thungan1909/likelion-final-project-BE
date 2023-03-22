const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        min: 6,
        max: 20,
    },
    content: {
        type: String,
        require: true,
        max: 150,
    },
    countLike: {
        type: Number,
        default: 0,
    },
    countDislike: {
        type: Number,
        default: 0,
    },
},
    {timestamps: true}
);
module.exports = mongoose.model("Idea", ideaSchema);
