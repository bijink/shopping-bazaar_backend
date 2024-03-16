var express = require("express");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  // console.log(req.session.user);
  productHelpers.getAllProducts().then(products => {
    // console.log("PRODUCTS:: ", products);
    res.render("user/view-products", { products, admin: false, user });
  });
});
router.get("/login", (req, res) => {
  res.render("user/login");
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  // res.render("user/signup");
  userHelpers.doSignup(req.body).then(res => {
    console.log(res);
  });
});
router.post("/login", (req, res) => {
  userHelpers.doLogin(req.body).then(response => {
    // console.log("RESULT:: ", response);
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
