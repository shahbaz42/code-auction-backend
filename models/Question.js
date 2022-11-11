const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
            team_id: {
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
        enum: ["private", "bidding", "sold"],
        default: "private"
    },
},
{
    timestamps: true
});

const Question = mongoose.model("Question", questionSchema);