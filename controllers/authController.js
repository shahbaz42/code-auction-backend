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
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token expired"
            });
        }

        console.log(typeof(error));
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
            member_2_email,
            member_3_name,
            member_3_email,
        } = req.body;

        const team = new Team({
            team_name,
            password,
            leader_name,
            leader_email,
            member_1_name,
            member_1_email,
            member_2_name,
            member_2_email,
            member_3_name,
            member_3_email,
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

        if (! team.login_count ) {
            team.login_count = 0;
        }

        // generate jwt
        const token = jwt.sign({ team_id: team._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // update login_count
        team.login_count += 1;
        await team.save();

        if ( team.login_count > process.env.MAX_LOGIN_ATTEMPTS ){
            return res.status(401).json({
                message: `You can log in on only ${process.env.MAX_LOGIN_ATTEMPTS} devices. Please contact coordinators.`
            });
        }

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

exports.forgotPassword = async (req, res) => {
    /*
    using team's old password hash and created date to generate a new token 
    it'll makeJWT a one-time-use token, 
    because once the team has changed their password, 
    it will generate a new password hash
    invalidating the secret key that references the old password.
    */
    try {
        const { leader_email } = req.body;
        const team = await Team.findOne({ leader_email });

        if (!team) {
            return res.status(400).json({
                message: "Leader email does not exist"
            });
        }

        const secret = process.env.JWT_SECRET + team.password + team.createdAt;
        const payload = {
            team_id: team._id,
        };

        try {
            var token = jwt.sign(payload, secret, { expiresIn: '15m' });
        } catch (error) {
            return res.status(500).json({
                message: "Invalid token."
            });
        }
        
        const link = `${process.env.HOSTNAME}/auth/password/reset/${team._id}/${token}`;
        // todo: send email 

        res.status(200).json({
            message: "Email sent successfully",
            link: link

        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { team_id, token } = req.params;
        const { new_password } = req.body;

        try {
            var team = await Team.findById(team_id);
        } catch (error) {
            return res.status(500).json({
                message: "Invalid link."
            });
        }

        if(!team) {
            return res.status(400).json({
                message: "Invalid link."
            });
        }

        const secret = process.env.JWT_SECRET + team.password + team.createdAt;
        
        try {
            var payload = jwt.verify(token, secret);
        } catch (error) {
            return res.status(500).json({
                message: "Link expired."
            });
        }

        team.password = new_password;
        const result = await team.save();
        
        res.status(200).json({
            message: "Password changed successfully"
        });
        
    } catch (error) {
        console.log("Error in reseting password.", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}