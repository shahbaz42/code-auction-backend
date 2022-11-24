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

exports.submitAnswer = async (req, res) => {
    try {
        const team = req.team;
        const assigned_qn_id = req.params.qn_id;
        const language_id = req.body.language_id;
        const attempted_solution = req.body.attempted_solution;

        const assigned_qn = await Question.findById(assigned_qn_id);
        const team_assigned_question = team.assigned_questions.find((question) => question.question_id == assigned_qn_id);

        const test_case = assigned_qn.test_case;
        const test_case_output = assigned_qn.test_case_output;

        // compile
        const compilation_result = await code_compiler.get_immediete_result(attempted_solution, language_id, test_case, test_case_output);

        // save the submission
        const new_submission = new Submission({
            token : compilation_result.token,
            submission_for : assigned_qn_id,
            submitted_by : req.team._id,
            status : compilation_result.status,
            result : compilation_result
        })
        await new_submission.save();

        // if the submisstion is accepted and status is pending then update the score`
        if( compilation_result.status.id == 3 && team_assigned_question.status == "pending" ) {
            team.score += assigned_qn.points;
            team_assigned_question.status = "solved";
            team_assigned_question.time_to_solve = Date.now() - team_assigned_question.assigning_time;
            team_assigned_question.submissions.push(new_submission._id);
            await team.save();

            return res.status(200).json({
                message: "Accepted",
                result : compilation_result
            });
        } 
        
        // if the submission is accepted but question is already solved
        if( compilation_result.status.id == 3 && team_assigned_question.status == "solved" ) {
            team_assigned_question.submissions.push(new_submission._id);
            await team.save();
            
            return res.status(200).json({
                message: "Accepted",
                result : compilation_result
            });
        }
        
        // if the submission is not accepted
        team_assigned_question.submissions.push(new_submission._id);
        await team.save();

        res.status(200).json({
            message: "Not Accepted",
            result : compilation_result
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
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