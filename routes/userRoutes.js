const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUSer)
  .patch(userController.updateUser)
  .delete(userController.deleteUSer);


module.exports = router;
