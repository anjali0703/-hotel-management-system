const express = require("express");
const router = express.Router();
const Category = require("../models/MenuCategory");
const upload = require("../middleware/uploadCategory");


// ✅ GET ALL (ONLY ACTIVE & NOT DELETED)
router.get("/", async (req, res) => {
  try {
    const data = await Category.find({ deleted: false, active: true });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ✅ ADD CATEGORY
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file
      ? `/uploads/Category/${req.file.filename}`   
      : "";

    const category = new Category({
      name: req.body.name,
      image: imagePath,
      createdBy: "Admin",
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// ✅ UPDATE CATEGORY
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      modifiedBy: "Admin",
      modifiedDateTime: new Date(),
    };

    if (req.file) {
      updateData.image = `/uploads/Category/${req.file.filename}`;
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// ✅ SOFT DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedBy: "Admin",
      deletedDateTime: new Date(),
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
// ✅ RESTORE CATEGORY
router.put("/restore/:id", async (req, res) => {
  try {
    const restored = await Category.findByIdAndUpdate(
      req.params.id,
      {
        deleted: false,
        deletedBy: null,
        deletedDateTime: null,
        modifiedBy: "Admin",
        modifiedDateTime: new Date(),
      },
      { new: true }
    );

    res.json(restored);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ✅ GET DELETED
router.get("/deleted", async (req, res) => {
  const data = await Category.find({ deleted: true });
  res.json(data);
});

module.exports = router;