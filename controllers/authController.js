// --------------authMiddleware-----------------
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const Team = require('../models/Team')

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
    const { team_name, password, leader_name, leader_email, member_1_name, member_1_email, member_2_name, member_2_email  } = req.body;
    //const token = password
    const teamExist = await Team.findOne({team_name: team_name});
    if (teamExist)
    return res.status(400).json({ error: "The team name already exists" });

    const emailExist = await Team.findOne({ leader_email: leader_email, member_1_email: member_1_email, member_2_email: member_2_email });
    if (emailExist)
    return res.status(400).json({ error: "email already exists" });

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

    if(this.isModified('password')){ //if password is filled by user only then this works
      this.password = await bcrypt.hash(this.password , 12)//12 is salt length.//this keyword is used for the global object it belong

  }

    await team.save();
    //res.send('id: ' + req.params.id);
    res.status(200).json({ team });
    //res.send("Register");
}

// put Team mongodb id in jwt
exports.login = async (req, res) => {
  try {
    const {leader_email , password} = req.body; 

    if (!leader_email || !password){
        return res.status(400).json({error : "please fill all the details"})  //validation of filling all the fields;;
    }

    const signin = await Team.findOne({leader_email: leader_email});
    
    if (signin){
    const match = await bcrypt.compare(password, signin.password);  
    
    if(!match){        
        res.status(400).json({error :"invalid credentials.pass"})
    }
    else{
        let tokenJ = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
        
    }}else{
        res.status(400).json({error :"invalid credetials"})
    }
}catch(err){console.log(err);
    // res.send("Login");
}}

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
    // res.send("Logout");
}

exports.forgotPassword = async (req, res) => {
    res.send("Forgot Password");
}

exports.resetPassword = async (req, res) => {
    Team.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
    .then((team) => {
        if (!team) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

        team.password = req.body.password;
        team.resetPasswordToken = undefined;
        team.resetPasswordExpires = undefined;

        // Save
        team.save((err) => {
            if (err) return res.status(500).json({message: err.message});

            // send email
            const mailOptions = {
                to: team.leader_email,
                from: process.env.ADMIN_EMAIL,
                subject: "Your password has been changed",
                text: `Hi ${team.team_name} \n 
                This is a confirmation that the password for your account ${team.leader_email} has just been changed.\n`
            };

            sgMail.send(mailOptions, (error, result) => {
                if (error) return res.status(500).json({message: error.message});

                res.status(200).json({message: 'Your password has been updated.'});
            });
    // res.send("Reset Password");
});
});
};