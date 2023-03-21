const userController = require("../controllers/userController.js");
const {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

//GET USER BY ID
router.get("/:id", verifyToken, userController.getUserById);

//DELETE USER
router.delete(
  "/:id/delete",
  verifyTokenAndUserAuthorization,
  userController.deleteUser
);

//UPDATE USER
router.put("/:id/update", verifyTokenAndUser, userController.updateUser);

module.exports = router;
