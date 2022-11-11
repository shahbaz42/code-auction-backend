require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const contestRouter = require('./routes/contestRouter');
const questionRouter = require('./routes/questionRouter.js')
const teamRouter = require("./routes/teamRouter");
const { authMiddleware, checkAdmin } = require('./controllers/authController');

const app = express();

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', authMiddleware, checkAdmin, adminRouter);
app.use('/contest', authMiddleware, contestRouter);
app.use('/question', authMiddleware, questionRouter);
app.use('/team', authMiddleware, teamRouter)

module.exports = app;


/*
API : Plans

Auth APIs : 
1. (routing done) /auth/register | POST | Register a new team
2. (routing done) /auth/login | POST | Login a team
3. (routing done) /auth/logout | GET | Logout a team
4. (routing done) /auth/password/reset | POST | Send a reset password link to the team's leader email
5. (routing done) /auth/password/reset/:token | POST | Reset the password of the team

Question APIs :
1. (routing done) /question | GET | Get a list the questions 
2. (routing done) /question/:id | GET | Get a question by id
3. (routing done) /question | POST | Create a new question | Admin only
4. (routing done) /question/:id | patch | Update a question by id | Admin only
5. (routing done) /question/:id | DELETE | Delete a question by id | Admin only
6. (routing done) /question/:id/get_bids | Get all bids of a question 
6. (routing done) /question/:id/place_bid | POST | Place bid for a question.
7. (routing done) /question/:id/submit | POST | Submit a solution for a question | fetch team id from token | check if the question is assigned to the team 

Team APIs : 
1. (routing done) /team | GET | Get a list of all teams
2. () /team/:id | GET | Get team by id

*/