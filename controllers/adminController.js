const Question = require("../models/Question");

const start_auction = async ( question_id ) => {
    // To-do integrate Socket.io
    return new Promise( async (resolve, reject) => {
        try {
            const question = await Question.findById(question_id);
            if(!question) return reject("Question not found");
            if (question.status === "bidding") return reject("Auction already started");
            question.status = "bidding";
            await question.save();
            return resolve(question);
        } catch (err) {
            return reject(err.message);
        }
    });
};

const stop_auction = async ( question_id ) => {
};

exports.startAuction = async (req, res) => {
    try {
        const question = await start_auction(req.params.qnid);
        return res.status(200).json({
            message: "Auction started",
            question
        });
    } catch (err) {
        return res.status(400).json({
            message: err
        });
    }
};

exports.stopAuction = async (req, res) => {
    
};

exports.sendQuestionsToAdmin = async (req, res) => {
    if (typeof (req.params.id) === 'undefined') {
        try {
            const questions = await Question.find();
            res.status(200).json({
                questions
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    } else {
        try {
            const id = req.params.id;
            const question = await Question.findById(id);
            res.status(200).json({
                question
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    }
}

exports.createQuestion = async (req, res) => {
    const {
        name,
        description,
        img_url,
        test_case,
        test_case_output,
        difficulty,
        base_price
    } = req.body;

    const question = new Question({
        name,
        description,
        img_url,
        test_case,
        test_case_output,
        difficulty,
        base_price,
    })

    const saved_question = await question.save();

    if (!saved_question) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }

    res.status(200).json({
        message: "Question created successfully",
        question: saved_question
    });
}

exports.updateQuestion = async (req, res) => {
    // this is the route for the admin to update one field of the question
    try {
        const id = req.params.id;
        const field = req.body.field;
        const value = req.body.value;

        //check if the field is valid
        const valid_fields = ["name", "description", "img_url", "test_case", "test_case_output", "difficulty", "base_price", "status"];
        if (!valid_fields.includes(field)) {
            return res.status(400).json({
                message: "Invalid field"
            });
        }

        // update the field
        const updated_question = await Question.findByIdAndUpdate(id, {
            [field]: value
        }, {
            new: true
        });

        if (!updated_question) {
            return res.status(500).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted_question = await Question.findByIdAndDelete(id);

        if (!deleted_question) {
            return res.status(500).json({
                message: "Question not found"
            });
        }

        res.status(200).json({
            message: "Question deleted successfully",
            question: deleted_question
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

exports.submitSolution = (req, res) => {
}

exports.getBids = (req, res) => {
}

exports.placeBid = (req, res) => {
}
