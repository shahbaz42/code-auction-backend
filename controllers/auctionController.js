const Question = require("../models/Question");
const Team = require("../models/Team");

// To-do : Implement pagination
exports.getAvailableQuestions = async (req, res) => {
    try {
        // all questions except private
        const questions = await Question.find({status: {$in: ["bidding", "sold", "unsold"]}}).sort('-createdAt')
            .select("name description difficulty base_price status");
        res.status(200).json({
            questions
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getOneQuestion = async (req, res) => {
    try {
        const id = req.params.id;

        const question = await Question.find({_id: id, status: {$in: ["bidding", "sold", "unsold"]}})
            .select("-test_case_output");

        res.status(200).json({
            question
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

// To-do : Implement pagination
exports.getBids = async (req, res) => {
    try {
        const id = req.params.id;
        // populate the bids array with team name
        const question = await Question.findById(id).populate({
            path: "bids.bid_by",
            select: "team_name -_id",
        });

        if (!question) {
            return res.status(500).json({
                message: "Question not found"
            });
        }
        const bids = question.bids;
        res.status(200).json({
            message: "Bids fetched successfully",
            bids
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
}

exports.placeBid = async (req, res) => {
    try {
        const id = req.params.id;
        const bid_price = parseInt(req.body.bid_price);
        const team = req.team;

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        if (question.status === "sold") {
            return res.status(400).json({
                message: "Question already sold",
            });
        }

        if (question.status === "private") {
            return res.status(400).json({
                message: "Question not available for bidding yet",
            });
        }

        const top_bid = question.bids[0];

        if (bid_price > team.balance) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        // if there is no top bid, then the bid price should be greater than base price
        if (!top_bid && question.base_price >= bid_price) {
            return res.status(400).json({
                message: "Bid price should be greater than base price",
            });
        }

        if (top_bid && top_bid.bid_price >= bid_price) {
            return res.status(400).json({
                message: "Bid price should be greater than top bid",
            });
        }

        const bid = {
            bid_by: team._id,
            bid_price,
        };

        question.bids.unshift(bid);
        await question.save();

        return res.status(200).json({
            message: "Bid placed successfully",
        });
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            message: err.message,
        });
    }
};