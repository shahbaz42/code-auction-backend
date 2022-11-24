const Team = require('../models/Team');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const code_compiler = require('../utils/code_compiler');

exports.sendLanguages = async (req, res, next) => {
    try {
        const languages = await code_compiler.get_languages();
        const filter = [54,50, 62, 63, 78, 71, 73]
        const filtered_languages = languages.filter((language) => filter.includes(language.id));
        res.status(200).json(filtered_languages);
    } catch (err) {
        return res.status(500).json({
            message : "Something went wrong."
        })
    }
} 