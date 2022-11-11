const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/adminController');
const authController = require('../controllers/authController')

router.post("/:id/submit",
    authController.authMiddleware,
    [
        param("id").exists().withMessage("Question id is required"),
        body("attempted_solution").exists().withMessage("Attempted solution is required")
    ],
    validateRequest,
    questionController.submitSolution
);

module.exports = router