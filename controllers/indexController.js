const Transaction = require("../models/Transactions");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}

exports.leaderboard = (req, res, next) => {
    res.send("Leaderboard");
}

exports.transactions = async(req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({message : "Page and limit should be positive integers"});
        }

        if (endIndex < await Transaction.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        results.transactions = await Transaction.find()
            .populate("from", "team_name")
            .sort({createdAt: -1})
            .skip(startIndex)
            .limit(limit);

        results.total = await Transaction.countDocuments();

        if (!results.transactions) {
            return res.status(500).json({
                message: "Couldn't fetch transactions"
            })
        }

        res.status(200).json(results);

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}