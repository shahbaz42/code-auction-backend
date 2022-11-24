const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/adminController');
const authController = require('../controllers/authController')
const contestController = require("../controllers/contestController");
const teamController = require("../controllers/teamController");

router.get('/languages', contestController.sendLanguages);
router.post('/submitAnswer/:qn_id',
    [
        param('qn_id').exists().withMessage("Question id is required"),
        body('attempted_solution').exists().withMessage("Attempted solution is required"),
        body('language_id').exists().withMessage("Language id is required"),
    ],    
teamController.checkIfQuestionIsAssigned, contestController.submitAnswer);

module.exports = router