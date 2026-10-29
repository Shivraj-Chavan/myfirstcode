import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js";

passport.use(
  new GoogleStrategy(
    // {
    //   clientID: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   callbackURL: "/auth/google/callback",
    // },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        pool.query(
          "SELECT * FROM users WHERE email=?",
          [email],
          (err, result) => {
            if (err) return done(err);

            if (result.length > 0) {
              return done(null, result[0]);
            }

            const newUser = {
              name: profile.displayName,
              email,
              google_id: profile.id,
              role: "student",
              is_verified: true,
            };

            pool.query(
              "INSERT INTO users SET ?",
              newUser,
              (err) => {
                if (err) return done(err);

                return done(null, newUser);
              }
            );
          }
        );
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

export default passport;