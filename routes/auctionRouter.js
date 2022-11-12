const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { validateRequest } = require('../utils/validator');
const authController = require('../controllers/authController')
const auctionController = require('../controllers/auctionController');

// ----------------------------Auction Routes --------------------------------

router.get("/question", auctionController.getAvailableQuestions);

router.get("/question/:id", auctionController.getOneQuestion);

router.get("/question/:id/get_bids", auctionController.getBids);

router.post("/question/:id/place_bid",
    [
        param("id").exists().withMessage("Question id is required"),
        body("bid_price").exists().withMessage("Bid price is required")
    ],
    validateRequest,
    auctionController.placeBid
);

module.exports = router