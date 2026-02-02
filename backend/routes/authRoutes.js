const express=require("express");
const passport=require("passport");
const jwt=require("jsonwebtoken");

const router=express.Router();

router.get("/google", (req, res, next) => {
  const source = req.query.source || "web";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: source
  })(req, res, next);
});


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const source = req.query.state; // comes from OAuth

    // 🔹 EXTENSION FLOW
    if (source === "extension") {
      const EXTENSION_ID = "bkoppfkiondldikaanlioejpfliphjjo";
      return res.redirect(
        `chrome-extension://${EXTENSION_ID}/auth-success.html?token=${token}`
      );
    }

    // 🔹 WEBSITE FLOW (DEFAULT)
    return res.redirect(
      `http://localhost:5173/auth-success?token=${token}`
    );
  }
);


module.exports=router;