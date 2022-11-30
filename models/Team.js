const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    },
    member_2_name: {
        type: String,
        required: true
    },
    member_2_email: {
        type: String,
        required: true,
    },
    member_3_name: {
        type: String,
    },
    member_3_email: {
        type: String,
    },
    balance: {
        type: Number,
        default: 500 // change later
    },
    assigned_questions: [
        {
            question_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },
            assigning_time: {
                type: Number,
                default: Date.now()
            },
            time_to_solve: {
                type: Number,
            },
            status: {
                type: String,
                enum: ["pending", "solved"],
                default: "pending"
            },
            submissions: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Submission"
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

// pre schema for hashing password
teamSchema.pre("save", async function (next) {
    const team = this;
    if (team.isModified("password")) {
        team.password = await bcrypt.hash(team.password, 8);
    }
    next();
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
