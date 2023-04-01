const User = require("../models/User");
const moment = require("moment");

const appController = {
  //search ALl
  searchAll: async (req, res) => {
    const { query } = req.query;
    try {
      const items = await Item.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = appController;
