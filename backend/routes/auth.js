const router = require("express").Router();
const authController = require("../controllers/authController.js");
const { verifyToken } = require("../controllers/verifyToken.js");

//REGISTER
router.post("/register", authController.registerUser);
//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOG OUT
router.post("/logout", verifyToken, authController.logOut);

module.exports = router;