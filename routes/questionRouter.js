const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController')

// --------------------------- Question Routes -------------------------------

//  /questions
router.get("/:id?", questionController.sendQuestions);

router.post("/", 
    authController.authMiddleware,
    authController.checkAdmin,
    [
        body("name").exists().withMessage("Name is required"),
        body("description").exists().withMessage("Description is required"),
        body("test_case").exists().withMessage("Test case is required."),
        body("difficulty").exists().withMessage("Difficulty ('easy', 'medium', 'hard') is required."),
        body("base_price").exists().withMessage("Base price is required.")
    ],
    validateRequest,
    questionController.createQuestion
); 

// this is the route for the admin to update one field of the question
router.patch("/:id",
    authController.authMiddleware,
    authController.checkAdmin,
    [
        param("id").exists().withMessage("Question id is required"),
        body("field").exists().withMessage("Field to be updated is required"),
        body("value").exists().withMessage("Value to be updated is required")
    ],
    validateRequest,
    questionController.updateQuestion
);

router.delete("/:id",
    authController.authMiddleware,
    authController.checkAdmin,
    [
        param("id").exists().withMessage("Question id is required")
    ],
    validateRequest,
    questionController.deleteQuestion
);

router.post("/:id/submit",
    authController.authMiddleware,
    [
        param("id").exists().withMessage("Question id is required"),
        body("attempted_solution").exists().withMessage("Attempted solution is required")
    ],
    validateRequest,
    questionController.submitSolution
);

// ----------------------------Auction Routes --------------------------------

router.get("/:id/get_bids", questionController.getBids);

router.post("/:id/place_bid",
    authController.authMiddleware,
    [
        param("id").exists().withMessage("Question id is required"),
        body("bid_price").exists().withMessage("Bid price is required")
    ],
    validateRequest,
    questionController.placeBid
);

module.exports = router