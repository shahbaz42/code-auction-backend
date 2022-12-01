const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.serverStatus);
router.get('/leaderboard', indexController.leaderboard);
router.get('/transactions', indexController.transactions);
router.get('/test_socket', (req, res) => {
    req.io.emit('socket_test', 'Socket is working!!');
    res.status(200).send("Successfully emitted socket event");
})

module.exports = router;