const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/user.model");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};



passport.use(
  "current",

  new JwtStrategy(
    options,

    async (jwt_payload, done) => {

      try {

        const user = await User.findById(jwt_payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);

      } catch (error) {

        return done(error, false);

      }

    }
  )
);



passport.use(
  "jwt",

  new JwtStrategy(
    options,

    async (jwt_payload, done) => {

      try {

        const user = await User.findById(jwt_payload.id);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);

      } catch (error) {

        return done(error, false);

      }

    }
  )
);


module.exports = passport;