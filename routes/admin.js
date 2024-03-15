var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let products = [
    {
      name: "Poco X5 Pro",
      category: "mobile",
      description: "Mobile designed by Xiaomi",
      imgUrl: "https://www.91-cdn.com/hub/wp-content/uploads/2023/02/POCO-X5-Pro.jpg",
    },
    {
      name: "Caspian",
      category: "water bottle",
      description: "Stainles steel water bottle of 1000ml",
      imgUrl: "https://m.media-amazon.com/images/I/51tfChUERVL.jpg",
    },
    {
      name: "iPhone 15 Pro",
      category: "mobile",
      description: "Mobile designed by Apple",
      imgUrl:
        "https://images.macrumors.com/t/oiWkxB5isnYn8BFbcgKsnDIUOdI=/800x0/smart/article-new/2023/09/iPhone-15-Pro-Lineup-Feature.jpg?lossy",
    },
    {
      name: "Dell OptiPlex 3020",
      category: "CPU",
      description: "PC CPU with Intel i5 processor",
      imgUrl:
        "https://www.myorderstore.com/image/cache/catalog/Products/Products/delloptiplex3020pc0-550x550w.jpg.webp",
    },
  ];
  res.render("admin/view-products", { products, admin: true });
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
