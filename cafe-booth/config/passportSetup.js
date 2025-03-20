const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
require("dotenv").config();
const bcrypt = require("bcrypt"); 

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            console.log("🔍 Checking login for:", email);

            const user = await User.findOne({ email });
            if (!user) {
                console.log("❌ User not found in DB");
                return done(null, false, { message: "User not found" });
            }

            if (!user.password) {
                console.log("⚠️ User registered with Google and has no password.");
                return done(null, false, { message: "Please set up a password before logging in." });
            }

            console.log("✅ User found:", user.email);
            console.log("🔑 Hashed password in DB:", user.password);

            const isMatch = await bcrypt.compare(password, user.password);
            console.log("🛠 Comparing passwords...");

            if (!isMatch) {
                console.log("❌ Password does not match");
                return done(null, false, { message: "Incorrect password" });
            }

            console.log("🎉 Login successful!");
            return done(null, user);
        } catch (error) {
            console.log("❌ Error during authentication:", error);
            return done(error);
        }
    })
);


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // ✅ Create new user if they don't exist
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        profilePic: profile.photos[0].value,
                    });

                    await user.save();
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);


// Serialize user (store user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from database)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
