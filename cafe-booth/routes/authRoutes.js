const express = require("express");
const path = require("path");
const router = express.Router();
const passport = require("passport");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Google authentication route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google authentication callback route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        if (!req.user.password) {
            return res.redirect("/auth/public/setup-password");
        }
        res.redirect("/dashboard");
    }
);

router.post("/login", (req, res, next) => {
    console.log("🔍 Login attempt for:", req.body.email);

    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            console.log("❌ Server error during login:", err);
            return res.status(500).json({ message: "Server error" });
        }
        if (!user) {
            console.log("❌ Invalid credentials:", info ? info.message : "Unknown reason");
            return res.status(401).json({ message: info ? info.message : "Invalid credentials" });
        }

        req.login(user, (err) => {
            if (err) {
                console.log("❌ Login session error:", err);
                return res.status(500).json({ message: "Login failed" });
            }
            console.log("🎉 Login successful for:", user.email);
            return res.json({ success: true, message: "Login successful!" });
        });
    })(req, res, next);
});



// Serve the setup password page
router.get("/public/setup-password", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "../public/setup-password.html"));
});

// Handle password setup
router.post("/set-password", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.redirect("/login");
        });
    });
});

// User info route (fetches user from DB)
router.get("/user", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json(null);
    }

    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user data" });
    }
});

// Serve dashboard (protected)
router.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

// Serve login page
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

module.exports = router;
