const Transaction = require("../models/Transactions");
const Team = require("../models/Team");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}

exports.leaderboard = async(req, res, next) => {
    try {

        const leaderboard = []

        const team_data = await Team.find({})
            .select("team_name score assigned_questions")
            .sort({score: -1})
        
        team_data.forEach(team => {
            let time_to_solve = 0;
            team.assigned_questions.forEach(question => {
                if (question.status === "solved") {
                    time_to_solve += question.time_to_solve;
                }
            })
            leaderboard.push({
                team_name: team.team_name,
                score: team.score,
                time_to_solve: time_to_solve
            })
        })

        // sort leaderboard by score and then by time_to_solve
        leaderboard.sort((a, b) => {
            if (a.score === b.score) {
                return a.time_to_solve - b.time_to_solve;
            }
            return b.score - a.score;
        })

        leaderboard.forEach((team, index) => {
            team.rank = index + 1;
        })

        res.status(200).json(leaderboard);
        
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
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