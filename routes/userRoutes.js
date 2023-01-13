const express = require("express");
const passport = require('passport');
const userController = require("./../controllers/userController");
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/forgotPassword', authController.forgotPassword );
router.patch('/resetPassword/:token',  authController.resetPassword );

router.patch('/updatePassword', passport.authenticate("jwt", { session: false }), authController.updatePassword );


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
