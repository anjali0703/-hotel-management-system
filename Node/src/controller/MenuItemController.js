const MenuItem = require("../models/MenuItem");

// ✅ GET (FILTER + SEARCH)
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = { deleted: false };

    if (category && category !== "All") {
      filter.menucategoryId = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const data = await MenuItem.find(filter)
      .populate("menucategoryId")
      .sort({ createdDateTime: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD + UPDATE
exports.saveMenuItem = async (req, res) => {
  try {
    const body = req.body;

    // Image
    if (req.file) {
      body.image = req.file.filename;
    }

    if (body.id) {
      // UPDATE
      const updated = await MenuItem.findByIdAndUpdate(
        body.id,
        { ...body, modifiedDateTime: new Date() },
        { new: true }
      );
      return res.json(updated);
    } else {
      // CREATE
      const item = new MenuItem(body);
      const saved = await item.save();
      return res.json(saved);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE (SOFT)
exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedDateTime: new Date(),
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};