const ideaController = require("../controllers/ideaController.js");
const { verifyToken } = require("../controllers/verifyToken.js");

const router = require("express").Router();
//create idea
router.post("/add", ideaController.createIdea);
//get all idea
router.get("/", ideaController.getAllIdeas);
//GET NEW IDEAS IN MONTH
router.get("/new-ideas-month", verifyToken, ideaController.getNewIdeasInMonth);
//GET NEW IDEAS PER WEEK IN MONTH
router.get("/new-ideas-per-week-in-month", verifyToken, ideaController.getNewIdeasInPerWeekMonth);
// //GET IDEAS BY USERID
// router.get("/userId/:id", verifyToken, ideaController.getAllIdeasByUserID);
//GET IDEAS BY IDEA ID
router.get("/:id",  ideaController.getIdeaById);
//LIKE IDEAS BY IDEA ID
router.post("/like/:id", verifyToken, ideaController.likeIdeaByIdeaId);
//UNLIKE IDEAS BY IDEA ID
router.post("/unlike/:id", verifyToken, ideaController.unlikeIdeaByIdeaId);
//GET IDEA BY AUTHOR
router.get("/author/:id", verifyToken, ideaController.getAllIdeasByAuthor);


module.exports = router;