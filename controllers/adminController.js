const Question = require("../models/Question");
const Team = require("../models/Team");
const Transaction = require("../models/Transactions");
const axios = require('axios');
const code_compiler = require('../utils/code_compiler');

exports.create_Transaction = async (original_data, updated_data) => {
    return new Promise( async(resolve, reject) => {
        try{
            // try to update the database
            await updated_data.question.save();
            await updated_data.team.save();
            await updated_data.transaction.save();
            resolve("Transaction Successful.")
        } catch (err) {
            // if any error occurs during saving then revert the changes.
            await original_data.question.save();
            await original_data.team.save();
            reject("Transaction Failed. All changes have been reverted.")
        }
    }) 
}

exports.startAuction = async (req, res) => {
    try {
        const question_id = req.params.qnid;
        const question = await Question.findById(question_id);
        if(!question) return res.status(404).json({message: "Question not found"});
        if (question.status === "bidding") return res.status(400).json({message: "Auction already started"});
        question.status = "bidding";
        await question.save();
        const msg = `Auction started for question : ${question.name}`;
        req.io.emit("auction_started", msg );
        return res.status(200).json({
            message: msg
        });
    } catch (err) {
        return res.status(400).json({
            message: err
        });
    }
};

exports.stopAuction = async (req, res) => {
    try {
        const question_id = req.params.qnid;
        const original_data = {}
        const updated_data = {}

        // populate the question bids array containing the bid_by and bid_price populate bid_by with team_name
        const question = await Question.findById(question_id).populate({
            path: "bids",
            populate: {
                path: "bid_by",
                select: "team_name balance"
            }
        });

        // original data in case transaction fails
        original_data.question = question;

        if(!question) return res.status(404).json({message: "Question not found"});
        if (question.status === "private") return res.status(400).json({message: "Auction has not started yet"});
        if (question.status === "sold") return res.status(400).json({message: "Auction already stopped"});

        const bids = question.bids;

        // if there is no bid then make the status unsold
        if (bids.length === 0) {
            question.status = "unsold";
            await question.save();
            req.io.emit("auction_stopped_not_sold", "Auction stopped. No bids placed." );
            return res.status(200).json({
                message: `Auction stopped for question ${question.name}, qn not sold`
            });
        }

        var sold = false;
        var sold_to = null;
        var sold_to_team_name = null;
        var sold_at = null;
        // // loop and check if team has enough balance if yes then mark sold and break
        for (var i = 0; i < bids.length; i++) {
            if (bids[i].bid_by.balance >= bids[i].bid_price) {
                sold = true;
                sold_to = bids[i].bid_by._id;
                sold_to_team_obj = bids[i].bid_by;
                sold_to_team_name = bids[i].bid_by.team_name;
                sold_at = bids[i].bid_price;
                break;
            }
        }

        if (sold) {
            // deduct the balance from the team and push to assigned_questions
            const team = await Team.findById(sold_to);
            original_data.team = team;

            const assigned_question = {
                question_id: question._id,
                assigning_time: Date.now(),
                time_to_solve: undefined,
                status: "pending",
                submittions: []
            }

            // update team details
            team.assigned_questions.push(assigned_question);
            team.balance -= sold_at;

            // update the question status to sold
            question.status = "sold";
            question.sold_to = sold_to;
            question.sold_to_team_name = sold_to_team_name;
            question.sold_at = sold_at;

            // create a transaction
            const transaction = new Transaction({
                to : "admin",
                from: sold_to._id,
                amount: sold_at,
                description: `${question.name}`
            })

            updated_data.question =  question;
            updated_data.team = team;
            updated_data.transaction = transaction;

            // pass to create transaction function to create transaction.
            try {
                await exports.create_Transaction(original_data, updated_data);
                req.io.emit("auction_stopped_sold", `Auction stopped for question : ${question.name}, qn sold to ${sold_to_team_name} at ${sold_at}` );
                return res.status(200).json({
                    message: `Auction stopped for question : ${question.name}, qn sold to ${sold_to_team_name} at ${sold_at}`
                });
            } catch (error) {
                console.log(error);
                return res.status(200).json({
                    message: `Transaction failed, all changes have been reverted.`
                });
            }
        }

        // if no team has enough balance then mark unsold
        question.status = "unsold";
        await question.save();
        req.io.emit("auction_stopped_not_sold", `Auction stopped for question : ${question.name}, qn not sold. no team has sufficient money.` );
        return res.status(200).json({
            message: `Auction stopped for question ${question.name}, qn not sold`
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err
        });
    }
};

// To-do : Implement pagination
exports.sendQuestionsToAdmin = async (req, res) => {
    if (typeof (req.params.id) === 'undefined') {
        try {
            const questions = await Question.find();
            res.status(200).json({
                questions
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    } else {
        try {
            const id = req.params.id;
            const question = await Question.findById(id);
            res.status(200).json({
                question
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
}

exports.createQuestion = async (req, res) => {
    const {
        name,
        description,
        img_url,
        test_case,
        private_test_cases,
        test_case_output,
        difficulty,
        base_price
    } = req.body;

    const question = new Question({
        name,
        description,
        img_url,
        test_case,
        private_test_cases,
        test_case_output,
        difficulty,
        base_price,
    })

    const saved_question = await question.save();

    if (!saved_question) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }

    res.status(200).json({
        message: "Question created successfully",
        question: saved_question
    });
}

exports.updateQuestion = async (req, res) => {
    // this is the route for the admin to update one field of the question
    try {
        const id = req.params.id;
        const field = req.body.field;
        const value = req.body.value;

        //check if the field is valid
        const valid_fields = ["name", "description", "img_url", "test_case", "test_case_output", "difficulty", "base_price", "status"];
        if (!valid_fields.includes(field)) {
            return res.status(400).json({
                message: "Invalid field"
            });
        }

        // update the field
        const updated_question = await Question.findByIdAndUpdate(id, {
            [field]: value
        }, {
            new: true
        });

        if (!updated_question) {
            return res.status(500).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted_question = await Question.findByIdAndDelete(id);

        if (!deleted_question) {
            return res.status(500).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question deleted successfully",
            question: deleted_question
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

// ---------------------------Admin Compiler Controllers -------------------------------

exports.sendCompilerInfo = async (req, res, next) => {
    try {
        const sysinfo = await code_compiler.get_system_info();
        res.status(500).json({
            message : "Compiler is up and running.",
            sysinfo
        });
    } catch (err) {
        console.log(err);
        if (err instanceof axios.AxiosError) {
            return res.status(500).json({
                message : "Server is down."
            }) 
        }
        return res.status(500).json({
            message : "Something went wrong."
        })
    }
}

exports.submitSolution = (req, res) => {
}

exports.getBids = (req, res) => {
}

exports.placeBid = (req, res) => {
}
