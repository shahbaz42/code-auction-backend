const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    to : {
        type: String,
        default: "admin",
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction