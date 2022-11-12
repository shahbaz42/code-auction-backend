const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        default: "na"
    },
    description: {
        type: String,
        required: true
    },
    test_case: {
        type: String,
        required: true
    },
    test_case_output: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    bids: [
        {
            bid_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team"
            }, 
            bid_price: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["private", "bidding", "sold", "unsold"],
        default: "private"
    },
    sold_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    sold_at: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;