const ideaController = require("../controllers/ideaController.js");
const { route } = require("./auth");

const router = require("express").Router();
//create idea
router.post("/add", ideaController.createIdea);
//get all idea
router.get("/",ideaController.getAllIdeas);
module.exports = router;