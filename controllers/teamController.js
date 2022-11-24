const Team = require('../models/Team');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const code_compiler = require('../utils/code_compiler');

exports.checkIfQuestionIsAssigned = async (req, res, next) => {
    try {
        const id = req.team._id;
        const assigned_questions = req.team.assigned_questions;
        const qn_id = req.params.qn_id;
        const isAssigned = assigned_questions.find((question) => question.question_id == qn_id);

        if ( typeof isAssigned === "undefined" ) {
            return res.status(400).json({
                status: "error",
                message: "Question is not assigned to you"
            });
        }
        next();

    } catch (error) {
        res.send(500).json({
            message: "Something went wrong."
        })
    } 
}

// to-do add pagination
exports.sendTeamsData = async (req, res, next) => {
    try {
        const id = req.team._id;
        const team = await Team.findById(id)
            .select("-password -assigned_questions -__v")
            res.status(200).json(team);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.getAssignedQuestions = async (req, res, next) => {
    try {
        const id = req.team._id;
        // to-do populate with submittion also..
        const team_data = await Team.findById(id)
            .select("assigned_questions")
            .populate({
                path: "assigned_questions",
                populate: {
                    path: "question_id",
                    select: "name img_url description test_case difficulty base_price",
                }
            })
        res.status(200).json(team_data.assigned_questions);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}