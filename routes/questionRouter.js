const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const questionController = require('../controllers/questionController');
const authController = require('../controllers/authController')

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