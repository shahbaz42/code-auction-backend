const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    to : {
        type: String,
        default: "admin",
        required: true
    },
    from: {
        type: String,
        default: "admin",
        required: true
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