var express = require("express");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var router = express.Router();

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user;
  let cartCount = null;
  if (user) {
    cartCount = await userHelpers.getCartCount(user._id);
  }
  productHelpers.getAllProducts().then(products => {
    // console.log("PRODUCTS:: ", products);
    res.render("user/view-products", { products, admin: false, user, cartCount });
  });
});
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signup", (req, res) => {
  userHelpers.doSignup(req.body).then(response => {
    console.log("User signed up");
    // console.log("USER_SIGNUP_RES:: ", response);
    req.session.loggedIn = true;
    req.session.user = response.user;
    res.redirect("/");
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
      req.session.loginErr = "Invalid username or password";
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get("/cart", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartProducts = await userHelpers.getCartProducts(userId);
  let cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
  // console.log(cartProducts);
  res.render("user/cart", { cartProducts, admin: false, user, cartTotalAmount });
});
router.get("/add-to-cart/:prodId", verifyLogin, (req, res) => {
  let prodId = req.params.prodId;
  let userId = req.session.user._id;
  // console.log("api called");
  userHelpers.addToCart(prodId, userId).then(response => {
    res.json({ status: response.status });
  });
});
router.get("/remove-from-cart", (req, res) => {
  let userId = req.session.user._id;
  let { cartId, prodId } = req.query;
  userHelpers.removeFromCart(userId, cartId, prodId).then(async response => {
    let cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
    res.json({ status: true, cartTotalAmount });
  });
});
router.post("/change-cart-item-quantity", (req, res) => {
  let userId = req.session.user._id;
  let { cartId, prodId, quantity, count } = req.body;
  quantity = Number(quantity);
  count = Number(count);
  if (quantity == 1 && count == -1) {
    userHelpers.removeFromCart(userId, cartId, prodId).then(async response => {
      let cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
      res.json({ status: true, itemRemoved: true, cartTotalAmount });
    });
  } else {
    userHelpers.changeCartItemQuantity(cartId, prodId, count).then(async response => {
      let cartTotalAmount = await userHelpers.getCartTotalAmount(userId);
      res.json({ status: true, itemRemoved: false, cartTotalAmount });
    });
  }
});
router.get("/place-order", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let totalAmount = await userHelpers.getCartTotalAmount(user._id);
  res.render("user/place-order", { user, totalAmount });
});
router.post("/place-order", async (req, res) => {
  let userId = req.session.user._id;
  let products = await userHelpers.getCartProductList(userId);
  let totalAmount = await userHelpers.getCartTotalAmount(userId);
  userHelpers.placeOrder(userId, req.body, products, totalAmount).then(response => {
    // console.log(response);
    res.json({ status: true, orderStatus: response.orderStatus });
  });
});
router.get("/order-success", (req, res) => {
  res.render("user/order-success");
});
router.get("/orders", verifyLogin, (req, res) => {
  let user = req.session.user;
  userHelpers.getOrders(user._id).then(response => {
    res.render("user/orders", { user, orders: response });
  });
});
router.get("/view-order-products/:orderId", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let orderProducts = await userHelpers.getOrderProducts(req.params.orderId);
  res.render("user/view-order-products", { user, orderProducts });
});

module.exports = router;
