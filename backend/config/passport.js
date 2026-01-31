const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { signToken } = require("../utils/jwt");


function generateUsername(profile) {
  const base =
    profile.emails?.[0]?.value.split("@")[0] ||
    profile.displayName.replace(/\s+/g, "").toLowerCase();

  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}_${random}`;
}


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
        googleId: profile.id,
        username: generateUsername(profile),
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value
        });

        const token = signToken(user);
        res.redirect(
        `http://localhost:3000/auth/success?token=${token}`
        );
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
