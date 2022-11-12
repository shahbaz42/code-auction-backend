const Team = require('../models/Team');

// to-do add pagination
exports.sendTeamsData = async (req, res, next) => {
    const id = req.params.id
    if (typeof (id) === 'undefined') {
        try {
            const teams = await Team.find({}).populate({
                path: 'assigned_questions.question_id',
                select: 'name description difficulty'
            }).select('-password -assigned_questions.question_id.test_case_output -assigned_questions.submittions -__v');

            res.status(200).json({
                teams
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    } else {
        try {
            const team = await Team.findById(id)
                .populate({
                    path: 'assigned_questions.question_id',
                    select: 'name description difficulty'
                }).select('-password -assigned_questions.question_id.test_case_output -assigned_questions.submittions -__v');

            res.status(200).json({
                team
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}