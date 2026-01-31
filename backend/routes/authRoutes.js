const express=require("express");
const passport=require("passport");
const jwt=require("jsonwebtoken");

const router=express.Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false
    }),
    (req, res)=>{
        const token=jwt.sign(
            {id: req.user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // CORRECT
const EXTENSION_ID = "bkoppfkiondldikaanlioejpfliphjjo";
res.redirect(`chrome-extension://${EXTENSION_ID}/auth-success.html?token=${token}`);

    }
);

module.exports=router;