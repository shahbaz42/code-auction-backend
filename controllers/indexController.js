exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}

exports.leaderboard = (req, res, next) => {
    res.send("Leaderboard");
}

exports.transactions = (req, res, next) => {
    res.send("Transactions");
}