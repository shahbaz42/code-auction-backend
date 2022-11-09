// --------------authMiddleware-----------------

exports.authMiddleware = async (req, res, next) => {
}

// -------------- authControllers --------------

exports.register = async (req, res) => {
    res.send("Register");
}

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