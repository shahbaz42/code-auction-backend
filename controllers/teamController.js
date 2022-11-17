const Team = require('../models/Team');

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
        const assigned_question = await Team.findById(id)
            .populate({
                path: "assigned_questions",
                populate: {
                    path: "question_id",
                    select: "name img_url description test_case difficulty base_price",
                }
            })
        res.status(200).json(assigned_question);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}