const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/adminController');
const authController = require('../controllers/authController')

// ---------------------------Admin Question Routes -------------------------------

router.get("/question/:id?", questionController.sendQuestionsToAdmin);

router.post("/question", 
    authController.authMiddleware,
    authController.checkAdmin,
    [
        body("name").exists().withMessage("Name is required"),
        body("description").exists().withMessage("Description is required"),
        // body("img_url").exists().withMessage("Test case is required"), optional
        body("test_case").exists().withMessage("Test case is required."),
        body("difficulty").exists().withMessage("Difficulty ('easy', 'medium', 'hard') is required."),
        body("base_price").exists().withMessage("Base price is required.")
    ],
    validateRequest,
    questionController.createQuestion
); 

// this is the route for the admin to update one field of the question
router.patch("/question/:id",
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

router.delete("/question/:id",
    authController.authMiddleware,
    authController.checkAdmin,
    [
        param("id").exists().withMessage("Question id is required")
    ],
    validateRequest,
    questionController.deleteQuestion
);


// ---------------------------Admin Auction Routes -------------------------------

router.get("/question/startAuction/:qnid", questionController.startAuction);
router.get("/question/stopAuction/:qnid", questionController.stopAuction);


module.exports = router