const Idea = require("../models/Idea");
const ideaController = {
  //Get All Idea
  getAllIdeas: async (req, res) => {
    try {
      const idea = await Idea.find();
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Get Idea By ID
  getIdeaById: async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //create idea
  createIdea: async (req, res) => {
    try {
      //create idea
      const newIdea = await new Idea({
        userId: req.body.userId,
        content: req.body.content,
      });
      //save idea to db
      const idea = await newIdea.save();
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
module.exports = ideaController;
