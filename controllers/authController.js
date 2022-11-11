const Team = require('../models/Team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --------------authMiddleware-----------------

// attach team_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    next();
}

// admin is the one with leader_email === process.env.ADMIN_EMAIL
exports.checkAdmin = (req, res, next) => {
    next();
}

// -------------- authControllers --------------

exports.register = async (req, res) => {
    // to-do add captcha
    const {
        team_name,
        password,
        leader_name,
        leader_email,
        member_1_name,
        member_1_email,
        member_2_name,
        member_2_email
    } = req.body;
    
    const team = new Team({
        team_name,
        password,
        leader_name,
        leader_email,
        member_1_name,
        member_1_email,
        member_2_name,
        member_2_email
    });

    //check if team already exists
    const teamExists = await Team.findOne({ team_name });
    if (teamExists) {
        return res.status(400).json({
            message: "Team already exists"
        });
    }

    //check if leader email already exists
    const leaderEmailExists = await Team.findOne({ leader_email });
    if (leaderEmailExists) {
        return res.status(400).json({
            message: "Leader email already exists"
        });
    }

    // else save team
    const savedTeam = await team.save();
    res.status(200).json({
        message: "Team registered successfully",
        team: savedTeam
    });
}

// put Team mongodb id in jwt
exports.login = async (req, res) => {
    const { leader_email, password } = req.body;

    // check if team exists
    const team = await Team.findOne({ leader_email });
    if (!team) {
        return res.status(401).json({
            message: "Leader email does not exist"
        });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, team.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }

    // generate jwt
    const token = jwt.sign({ team_id: team._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.status(200).json({
        message: "Login successful",
        token
    });
}

exports.logout = async (req, res) => {
    res.send("Logout");
}

exports.forgotPassword = async (req, res) => {
    res.send("Forgot Password");
}

exports.resetPassword = async (req, res) => {
    res.send("Reset Password");
}