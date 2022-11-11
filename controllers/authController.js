const Team = require('../models/Team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --------------authMiddleware-----------------

// attach team_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    try {
        const authorization_header_token = req.headers.authorization;
        if (!authorization_header_token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authorization_header_token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // todo : populate team with assigned questions
        const team = await Team.findById(decoded.team_id).select("-password");
        if (!team) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        req.team = team;
        console.log(team);
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

// admin is the one with leader_email === process.env.ADMIN_EMAIL
exports.checkAdmin = (req, res, next) => {
    try {
        if (req.team.leader_email === process.env.ADMIN_EMAIL) {
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
    } catch (error) {
        console.log("error at checkAdmin.", error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

// -------------- authControllers --------------

exports.register = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

// put Team mongodb id in jwt
exports.login = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
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