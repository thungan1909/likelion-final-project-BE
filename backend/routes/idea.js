const ideaController = require("../controllers/ideaController.js");
const { verifyToken } = require("../controllers/verifyToken.js");

const router = require("express").Router();
//create idea
router.post("/add", ideaController.createIdea);
//get all idea
router.get("/", ideaController.getAllIdeas);
//GET NEW IDEAS PER WEEK IN MONTH
router.get("/new-ideas-per-week-in-month", verifyToken, ideaController.getNewIdeasInPerWeekMonth);

module.exports = router;