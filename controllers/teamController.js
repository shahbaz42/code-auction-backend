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