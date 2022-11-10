exports.sendQuestions = (req, res) => {
    if (typeof(req.params.id) === 'undefined'){
        res.send("should send all questions, without test_case output.")
    } else {
        const id = req.params.id;
        res.send(`should send question id ${id}`);
    }
}

exports.createQuestion = (req, res) => {
    res.send("This route should create a new question.")
}

exports.updateQuestion = (req, res) => {
    res.send("This route should update a question.")
}

exports.deleteQuestion = (req, res) => {
    res.send("This route should delete a question.")
}

exports.submitSolution = (req, res) => {
    res.send("This route should submit a solution.")
}

exports.getBids = (req, res) => {
    res.send("This route should send all bids of a question.")
}

exports.placeBid = (req, res) => {
    res.send("This route should place a bid.")
}
