const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../utils/validator');

router.post('/register',
  [
    body('team_name').exists().withMessage('Team name is required'),
    body('password').exists().withMessage('Password is required'),
    body('leader_name').exists().withMessage('Leader name is required'),
    body('leader_email').exists().withMessage('Leader email is required'),
    body('member_1_name').exists().withMessage('Member 1 name is required'),
    body('member_1_email').exists().withMessage('Member 1 email is required'),
    body('member_2_name').exists().withMessage('Member 2 name is required'),
    body('member_2_email').exists().withMessage('Member 2 email is required'),
    body('member_3_name').exists().withMessage('Member 3 name is required'),
    body('member_3_email').exists().withMessage('Member 3 email is required'),
  ], 
  validateRequest,
  authController.register
);

router.post('/login',
  [
    body('leader_email').exists().withMessage('Leader email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

router.post('/password/reset',
  [
    body("leader_email").exists().withMessage("Leader email is required"),
  ],
  validateRequest,
  authController.forgotPassword
);

router.post('/password/reset/:team_id/:token',
  [
    body("new_password").exists().withMessage("New password is required"),
  ],
  validateRequest,
  authController.resetPassword
);

module.exports = router;
