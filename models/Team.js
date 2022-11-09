const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    leader_name :{
        type: String,
        required: true
    },
    leader_email: {
        type: String,
        required: true,
        unique: true
    },
    member_1_name: {
        type: String,
        required: true
    },
    member_1_email: {
        type: String,
        required: true,
        unique: true
    },
    member_2_name: {
        type: String,
        required: true
    },
    member_2_email: {
        type: String,
        required: true,
        unique: true
    },
    coins: {
        type: Number,
        default: 500
    },
    assigned_questions: [
        {
            question_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },
            status: {
                type: String,
                enum: ["pending", "solved"],
                default: "pending"
            },
            submittions: [
                {
                    attempted_solution: {
                        type: String
                    },
                }
            ]
        }
    ],
    score : {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
