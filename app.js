const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');

const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

// Requiring authentication middleware
require('./authentication/auth')

const app = express();

// Middleware to parse user information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// 
app.get('/', (req, res) => {
    res.json({
      status: 'Success',
      message: 'Welcome to Blogging API, kindly visit the following links for information about usage',
      GitHub_link: 'https://github.com/TheKareemYusuf/Blogging-API',
    })
  })

// ROUTES
app.use("/api/v1/", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);

// unknown routes/endpoints
app.all('*', (req, res, next) => {
    res.json({
        status: 'fail',
        message: 'unknown endpoint, route does not exist'
    })
  });


module.exports = app;
