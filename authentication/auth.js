const passport = require("passport");
const passportCustom = require("passport-custom");

const User = require("./../models/userModel");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
    },
    async (token, next) => {
      try {
        return next(null, token.user);
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  "signup",
  new passportCustom(async (req, next) => {
    try {
      const { email, firstName, lastName, password, passwordConfirm } =
        req.body;
      const user = await User.create({
        email,
        firstName,
        lastName,
        password,
        passwordConfirm,
      });

      return next(null, user);
    } catch (error) {
      next(error);
    }
  })
);

passport.use(
  "login",
  new passportCustom(async (req, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return next(null, false, { message: "User not found" });
      }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        return next(null, false, { message: "Wrong Password" });
      }

      return next(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return next(error);
    }
  })
);
