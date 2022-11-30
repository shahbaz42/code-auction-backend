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
                    select: "name img_url description test_case test_case_output difficulty base_price",
                }
                // populate submission also
            })
        res.status(200).json(team_data.assigned_questions);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}


exports.getOneAssignedQuestion = async (req, res, next) => {
    try {
        const id = req.team._id;
        const qn_id = req.params.qn_id;
        
        const response = {}

        const question = await Question.findById(qn_id)
            .select("-__v -private_test_cases -bids -sold_to -sold_at -createdAt -updatedAt");
        
        const submissions = await Submission.find({ submission_for: qn_id, submitted_by: id })

        const last_submission = submissions[0];

        response.question = question;
        response.last_submission = last_submission.result.source_code;
        response.last_accepted_submission = null;

        submissions.forEach((submission) => {
            if (submission.status.id == 3) {
                response.last_accepted_submission = submission.result.source_code;
                return;
            }
        })


        // question["last_submission"] = submission.result.source_code;

        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}