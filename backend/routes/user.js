const userController = require("../controllers/userController.js");
const {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);


//GET NEW USERS IN MONTH
router.get("/new-users-month", verifyToken, userController.getNewUsersInMonth);
//GET NEW USERS PER WEEK IN MONTH
router.get("/new-users-per-week-in-month", verifyToken, userController.getNewUsersInPerWeekMonth);
//GET USER BY ID
router.get("/:id",  userController.getUserById);

//DELETE USER
router.delete(
  "/:id/delete",
  verifyTokenAndUserAuthorization,
  userController.deleteUser
);

//UPDATE USER
router.put("/:id/update", verifyTokenAndUser, userController.updateUser);

module.exports = router;
