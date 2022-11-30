const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/adminController');
const authController = require('../controllers/authController')
const teamController = require("../controllers/teamController");

router.get('/', teamController.sendTeamsData);
router.get('/assignedQuestions', teamController.getAssignedQuestions);
router.get('/assignedQuestion/:qn_id', teamController.checkIfQuestionIsAssigned, teamController.getOneAssignedQuestion);

module.exports = router