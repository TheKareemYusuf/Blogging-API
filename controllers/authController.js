const crypto = require("crypto");
const User = require("./../models/userModel");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./../config.env" });

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(error);
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(error);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const body = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
  };
  const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.status(200).json({
    status: "success",
    token,
  });
};

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(error)
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save()

    const body = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
    };
    const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
  
    res.status(200).json({
      status: "success",
      token,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword,
};
