const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.serverStatus);
router.get('/leaderboard', indexController.leaderboard);
router.get('/transactions', indexController.transactions);

module.exports = router;