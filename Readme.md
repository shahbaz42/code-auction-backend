# Code-Auction-Backend

## Description
Teams of coders and businesspeople compete on the Code-Auction-Portal to place bid and purchase questions and solve them on the integrated code compiler.
This is the backend for the Code Auction project. It is a REST API built with Node.js, Express.js and SocketIO It uses MongoDB as a database.

## API doc
https://documenter.getpostman.com/view/23141290/2s8YerLXMD

## Review
https://www.instagram.com/reel/Cm8gehjIKIG/

## Screenshots
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/rules.jpg?raw=true)
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/Auction%20Page.jpg?raw=true)
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/Coding%20page.jpg?raw=true)
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/leaderboard.jpg?raw=true)
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/Transaction%20History.jpg?raw=true)
![alt text](https://github.com/shahbaz42/code-auction-backend/blob/main/ScreenShots/About.jpg?raw=true)

## env
```
ADMIN_EMAIL=<admin_email>
COMPILER_URL=<compiler_url>
DB_URI=<db_uri>
HOSTNAME=<frontend_deployment_url>
JWT_SECRET=<JWT secret>
MAX_LOGIN_ATTEMPTS=2
```

## Installation
1. Clone the repository
2. Add .env file
3. Run `npm install` to install all dependencies
4. Run `npm start` to start the server
5. Run `npm run dev` to start the server in development mode
6. Run `npm run test` to run the tests
