const express = require("express");
const router = express.Router();
const UserType = require("../models/UserType");

router.post("/add", (req, res) => {
  const { typeId, typeName } = req.body;
  const userType = new UserType({ typeId, typeName });

  userType.save()
    .then(async () => {
      res.status(201).json({ message: "User Type added successfully" });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

router.get("/", (req, res) => {
  UserType.find({ deleted: false, active: true })
    .then(userTypes => {
      res.status(200).json(userTypes);
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
