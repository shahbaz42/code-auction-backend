const Team = require('../models/Team');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const code_compiler = require('../utils/code_compiler');
const axios = require("axios");

exports.sendCompilerStatus = async (req, res, next) => {
    try {
        await code_compiler.get_system_info();
        res.status(500).json({
            message : "Compiler is up and running."
        });
    } catch (err) {
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

exports.sendLanguages = async (req, res, next) => {
    try {
        const languages = await code_compiler.get_languages();
        const filter = [54,50, 62, 63, 78, 71, 73]
        const filtered_languages = languages.filter((language) => filter.includes(language.id));
        res.status(200).json(filtered_languages);
    } catch (err) {
        return res.status(500).json({
            message : "Something went wrong."
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
        const private_test_cases = assigned_qn.private_test_cases;
        var total_private_test_cases = private_test_cases.length;
        var private_test_cases_pass_count = 0;

        // compile public test case
        const compilation_result = await code_compiler.get_immediete_result(attempted_solution, language_id, test_case, test_case_output);

        // compile private test_case
        for await (const test_case of private_test_cases) {
            const input = test_case.input;
            const output = test_case.output;
            const private_test_case_compilation_result = await code_compiler.get_immediete_result(attempted_solution, language_id, input, output);
            // console.log(private_test_case_compilation_result);
            if(private_test_case_compilation_result.status.id == 3 ){
                private_test_cases_pass_count += 1;
            }
        }

        const private_test_cases_result = `${private_test_cases_pass_count}/${total_private_test_cases} private test cases passing.`

        // save the submission
        const new_submission = new Submission({
            token : compilation_result.token,
            submission_for : assigned_qn_id,
            submitted_by : req.team._id,
            status : compilation_result.status,
            result : compilation_result,
            private_test_cases_result
        })
        await new_submission.save();

        // if the submisstion is accepted and status is pending then update the score`
        if( compilation_result.status.id == 3 && team_assigned_question.status == "pending" && total_private_test_cases == private_test_cases_pass_count) {
            team.score += assigned_qn.points;
            team_assigned_question.status = "solved";
            team_assigned_question.time_to_solve = Date.now() - team_assigned_question.assigning_time;
            team_assigned_question.submissions.push(new_submission._id);
            await team.save();

            return res.status(200).json({
                message: `Accepted!! ${private_test_cases_result}`,
                result : compilation_result
            });
        } 
        
        // if the submission is accepted but question is already solved
        if( compilation_result.status.id == 3 && team_assigned_question.status == "solved" && total_private_test_cases == private_test_cases_pass_count) {
            team_assigned_question.submissions.push(new_submission._id);
            await team.save();
            
            return res.status(200).json({
                message: `Accepted!! ${private_test_cases_result}`,
                result : compilation_result
            });
        }
        
        // if the submission is not accepted
        team_assigned_question.submissions.push(new_submission._id);
        await team.save();

        res.status(200).json({
            message: `Not Accepted!! ${private_test_cases_result}`,
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