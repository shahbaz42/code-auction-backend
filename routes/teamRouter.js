const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController')
const teamController = require("../controllers/teamController");

router.get('/:id?', teamController.sendTeamsData);

module.exports = router