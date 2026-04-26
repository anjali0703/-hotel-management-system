// routes/auth.js
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");

const secretKey = "mySecretKey123!@#";

// decrypt password
const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, deleted: false })
    .populate("userTypeId") // 🔥 IMPORTANT FIX
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const decryptedPassword = decryptPassword(user.password);

      // check password
      if (password !== decryptedPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // success response
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          active: user.active,

          // 🔥 ROLE DATA (IMPORTANT)
          userTypeId: user.userTypeId?._id,
          userType: user.userTypeId?.usertype
        }
      });
    })
    .catch((err) => {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = router;