const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    token : {
        type :String
    },
    submission_for : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Question"
    },
    submitted_by : {
        type :mongoose.Schema.Types.ObjectId,
        ref : "Team"
    },
    status : {
        id : {
            type : Number
        },
        description : {
            type : String
        }
    },
    result : {},
    private_test_cases_result : {
        type : String,
    }
})

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission; 