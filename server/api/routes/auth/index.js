const express = require("express");
const router = express.Router();
const auth_controller = require("../../controllers/auth_controller");
const passport = require("passport");

router.post("/register", auth_controller.register_user);
router.post("/update_token", auth_controller.update_token);
router.post(
  "/login",
  passport.authenticate("local", {session: false}),
  auth_controller.login_user
);

module.exports = router;
