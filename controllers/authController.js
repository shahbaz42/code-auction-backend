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
    res.send("Register");
}

// put Team mongodb id in jwt
exports.login = async (req, res) => {
    res.send("Login");
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