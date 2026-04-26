const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const UserType = require("../models/UserType");

const secretKey = "mySecretKey123!@#";

const encryptPassword = (plainPassword) => {
  return CryptoJS.AES.encrypt(plainPassword, secretKey).toString();
};

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({
      deleted: false,
    }).populate("userTypeId");

    // Decrypt each user's password
    const decryptedUsers = users.map((user) => ({
      ...user._doc,
      password: decryptPassword(user.password), // Ensure this function is correctly implemented
    }));

    res.status(200).json(decryptedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const excludedUserTypeId = ""; // Use string directly

    // Fetch users where userTypeId is not the excluded value and not deleted
    const users = await User.find({
      deleted: false,
      userTypeId: { $ne: excludedUserTypeId },
    }).populate("userTypeId");

    // Decrypt each user's password
    const decryptedUsers = users.map((user) => ({
      ...user._doc,
      password: decryptPassword(user.password), // Ensure this function is correctly implemented
    }));

    res.status(200).json(decryptedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:userId", async (req, res) => {
  try {
    let { userId } = req.params; // Use let if you need to reassign the variable
    const excludedUserTypeId = process.env.REACT_APP_SUPERADMIN; // Use string directly

    // Fetch users with additional condition
    const users = await User.find({
      deleted: false,
      userTypeId: { $ne: excludedUserTypeId },
      $or: [{ _id: userId }, { createdBy: userId }, { parentId: userId }],
    }).populate("userTypeId");
    // }

    // Decrypt each user's password
    const decryptedUsers = users.map((user) => ({
      ...user._doc,
      password: decryptPassword(user.password), // Ensure this function is correctly implemented
    }));

    res.status(200).json(decryptedUsers);
  } catch (error) {
    console.error("Error occurred:", error); // Log the error for better debugging
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { password, createdBy, email, ...rest } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({ warning: "User with this email already exists." });
    }

    // Encrypt the password
    const encryptedPassword = encryptPassword(password);

    // Create user data
    const userData = {
      ...rest,
      email,
      password: encryptedPassword,
      createdDateTime: new Date(),
      createdBy: createdBy,
    };

    // Save the new user
    const user = new User(userData);
    await user.save();

    // Respond with the newly created user
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Ensure this comes from the URL parameter

    // Check if userId is valid
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const {
      name,
      email,
      password,
      userTypeId,
      confirmPassword,
      mobile,
      modifiedBy,
    } = req.body;

    // Password validation
    if (password && password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email already exists for another user (excluding the current user)
    const existingUserWithEmail = await User.findOne({ email: email, _id: { $ne: userId } });
    if (existingUserWithEmail) {
      return res.status(200).json({ warning: "User with this email already exists." });
    }

    // Validate user type (optional check if needed)
    /* const userType = await UserType.findById(userTypeId);
    if (!userType) {
      return res.status(400).json({ error: "Invalid user type" });
    } */

    // Prepare the update data
    const updateData = {
      name,
      email,
      mobile,
      userTypeId,
      modifiedDateTime: new Date(),
      modifiedBy: modifiedBy,
    };

    if (password) {
      // Encrypt the new password if provided
      updateData.password = encryptPassword(password);
    }

    // Attempt to update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the activity (if needed)
    // await logActivity(modifiedBy, `User updated successfully with ID: ${userId}`);

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { userId, deletedBy } = req.body;

    await User.findByIdAndUpdate(userId, {
      active: false,
      deleted: true,
      deletedDateTime: new Date(),
      deletedBy: deletedBy,
    });

    res.status(200).json({ message: "User marked as deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
