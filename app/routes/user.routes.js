module.exports = (app) => {
  const controller = require("../controllers/user.controller.js");
  const verifyToken = require("../middleware/verifytoken");
  var router = require("express").Router();
  const multer = require("multer");
  const upload = multer({
    dest: "temp/",
  });

  router.post("/signup", controller.create);

  router.post("/signin", controller.signin);
  // router.post("/upload",middleware, cont);

  //send otp
  router.post("/otp", controller.sendOtp);

  // send resetpassword link
  router.post("/forgetpassword", controller.resetPassword);

  //verify the resetpassword link and set new password
  router.get("/:id", controller.changepassword);

  app.use("/api/v1", router);
};
