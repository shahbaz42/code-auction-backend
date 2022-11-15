const Transaction = require("../models/Transactions");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}

exports.leaderboard = (req, res, next) => {
    res.send("Leaderboard");
}

exports.transactions = async(req, res, next) => {
    try {
        const transactions = await Transaction.find({})
            .select("to from amount description")
        if (!transactions) {
            return res.status(500).json({
                message: "Couldn't fetch transactions"
            })
        }
        res.status(200).json(transactions)
    } catch (error) {
        res.status(500).json({
            message : "Some error occured."
        })
    }
}