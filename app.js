const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");

const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

require("./authentication/auth");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// ROUTES

app.use("/api/v1/", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
