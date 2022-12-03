require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
const  {createServer} = require('http');
const  {Server} = require("socket.io")
const rateLimit = require('express-rate-limit')


const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const contestRouter = require('./routes/contestRouter');
const auctionRouter = require('./routes/auctionRouter.js')
const teamRouter = require("./routes/teamRouter");
const { authMiddleware, checkAdmin } = require('./controllers/authController');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
})

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 2000 // limit each IP to 100 requests per windowMs
    });

//  apply to all requests
app.use(limiter);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

app.use((req,res,next) => {
    req.io = io;
    next();
})

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

app.use(
    cors({
        origin: "*",
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', authMiddleware, checkAdmin, adminRouter);
app.use('/contest', authMiddleware, contestRouter);
app.use('/auction', authMiddleware, auctionRouter);
app.use('/team', authMiddleware, teamRouter)



httpServer.listen(process.env.PORT || '8000', () => {
    console.log(`Server started at port ${process.env.PORT || '8000'}`);
});
// module.exports = app;