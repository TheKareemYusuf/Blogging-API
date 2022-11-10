const express = require("express");
const passport = require('passport');
const blogController = require("./../controllers/blogController");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(passport.authenticate('jwt', { session: false }), blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(passport.authenticate('jwt', { session: false }), blogController.updateBlogState)
  .put(passport.authenticate('jwt', { session: false }), blogController.updateBlog)
  .delete(passport.authenticate('jwt', { session: false }), blogController.deleteBlog);


  module.exports = router;
