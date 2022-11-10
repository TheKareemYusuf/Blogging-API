const express = require("express");
const passport = require('passport');
const bodyParser = require('body-parser');

const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

require('./authentication/auth')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.json({
      status: 'status',
      message: 'Visit the following link(s) for details about usage',
      link: '/link to come here',
      readme: '/readme link here',
    })
  })
// ROUTES

app.use("/api/v1/", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);


app.all('*', (req, res, next) => {
    res.json({
        status: 'fail',
        message: 'unknown endpoint, route does not exist'
    })
  });


module.exports = app;
