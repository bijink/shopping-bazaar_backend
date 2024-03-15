var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProducts().then(products => {
    // console.log("PRODUCTS:: ", products);
    res.render("admin/view-products", { products, admin: true });
  });
});
router.get("/add-product", (req, res, next) => {
  res.render("admin/add-product", { admin: true });
});
router.post("/add-product", (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image);

  productHelpers.addProduct(req.body, id => {
    // console.log("ID:: ", id);
    let image = req.files.Image;
    image.mv("./public/images/product-images/" + id + ".png", (err, done) => {
      if (!err) res.render("admin/add-product", { admin: true });
      else console.log(err);
    });
  });
});

module.exports = router;
