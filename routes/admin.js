var express = require("express");
var router = express.Router();
const fs = require("fs");
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
    // Add image
    image.mv("./public/images/product-images/" + id + ".png", (err, done) => {
      if (!err) res.render("admin/add-product", { admin: true });
      else console.log(err);
    });
  });
});
// router.get("/delete-product/:id", (req, res) => {
//   let prodId = req.params.id;
//   console.log(prodId);
// });
router.get("/delete-product", (req, res) => {
  let prodId = req.query.id;
  // console.log(prodId);
  productHelpers.deleteProduct(prodId).then(response => {
    console.log(response);
    // Delete the file
    fs.unlink("./public/images/product-images/" + prodId + ".png", err => {
      if (!err) res.redirect("/admin");
      else console.log(err);
    });
  });
});

module.exports = router;
