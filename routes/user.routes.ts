import { Router } from 'express';
import { userHelpers } from '../helpers';
import mongoose from 'mongoose';
import collections from '../mongoose/collections';

const router = Router();

// !: for dev
router.get('/drop-db', async (req, res) => {
  mongoose.connection.db.dropDatabase();
  res.send('db dropped');
});
router.get('/drop-col', async (req, res) => {
  const collection = collections.USER_COLLECTION;
  mongoose.connection.collections[collection].drop();
  res.send(`${collection} collection dropped`);
});
// !: for dev

// const verifyLogin = (req: Request, res: Response, next: NextFunction) => {
//   if (req.session.loggedIn === 'user') {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// };
// TODO::
router.post('/signup', (req, res) => {
  userHelpers
    .doSignup(req.body)
    .then((response) => {
      // console.log('USER_SIGNUP_RES:: ', response);
      req.session.user = response.user;
      req.session.loggedIn = 'user';
      res.status(200).send(response);
    })
    .catch(() => {
      res.sendStatus(400);
    });
  // !:
  // userHelpers.doSignup(req.body).then(response => {
  //   console.log("User signed up");
  //   // console.log("USER_SIGNUP_RES:: ", response);
  //   req.session.user = response.user;
  //   req.session.loggedIn = "user";
  //   res.redirect("/");
  // });
  // !:
});
router.post('/login', (req, res) => {
  userHelpers
    .doLogin(req.body)
    .then((response) => {
      // console.log('RESULT:: ', response);
      req.session.user = response.user;
      req.session.loggedIn = 'user';
      res.status(200).send(response);
    })
    .catch((err) => {
      // console.log('Err', err);
      res.status(400).send(err);
    });
});
// router.get('/add-to-cart/:prodId', verifyLogin, (req, res) => {
//   const prodId = req.params.prodId;
//   const userId = req.session.user?._id;
//   // console.log("api called");
//   userHelpers.addToCart(prodId, userId).then((response) => {
//     res.json({ status: response.status });
//   });
// });
// router.get('/cart', verifyLogin, async (req, res) => {
//   const user = req.session.user;
//   const userId = req.session.user?._id;
//   const cartCount = user ? await userHelpers.getCartCount(user._id) : null;
//   const cartProducts = await userHelpers.getCartProducts(userId);
//   const cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
//   // console.log(cartProducts);
//   res.render('user/cart', {
//     cartProducts,
//     cartCount,
//     admin: false,
//     user,
//     cartTotalAmount,
//   });
// router.get('/remove-from-cart', (req, res) => {
//   const userId = req.session.user?._id;
//   const { cartId, prodId } = req.query;
//   userHelpers.removeFromCart(userId, cartId, prodId).then(async () => {
//     const cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
//     res.json({ status: true, cartTotalAmount });
//   });
// });
// router.post('/change-cart-item-quantity', (req, res) => {
//   const userId = req.session.user?._id;
//   const { cartId, prodId } = req.body;
//   let { quantity, count } = req.body;
//   quantity = Number(quantity);
//   count = Number(count);
//   if (quantity == 1 && count == -1) {
//     userHelpers.removeFromCart(userId, cartId, prodId).then(async () => {
//       const cartTotalAmount = (await userHelpers.getCartTotalAmount(userId)) ?? 0;
//       res.json({ status: true, itemRemoved: true, cartTotalAmount });
//     });
//   } else {
//     userHelpers.changeCartItemQuantity(cartId, prodId, count).then(async () => {
//       const cartTotalAmount = await userHelpers.getCartTotalAmount(userId);
//       res.json({ status: true, itemRemoved: false, cartTotalAmount });
//     });
//   }
// });
// router.get('/place-order', verifyLogin, async (req, res) => {
//   const user = req.session.user!;
//   const cartCount = user ? await userHelpers.getCartCount(user._id) : null;
//   const totalAmount = await userHelpers.getCartTotalAmount(user._id);
//   res.render('user/place-order', { user, totalAmount, cartCount });
// });
// router.post('/place-order', async (req, res) => {
//   const user = req.session.user!;
//   const products = await userHelpers.getCartProductList(user._id);
//   const totalAmount = await userHelpers.getCartTotalAmount(user._id);
//   if (totalAmount) {
//     userHelpers.placeOrder(user._id, req.body, products, totalAmount).then((response) => {
//       if (req.body.paymentMethod == 'cod') {
//         res.json({ status: 'cod-success' });
//       } else {
//         userHelpers.generateRazorpay(response.orderId, response.amount).then((order) => {
//           const userObj = {
//             name: user.name,
//             email: user.email,
//             contact: req.body.mobile,
//           };
//           res.json({ status: 'online-pending', user: userObj, order });
//         });
//       }
//     });
//   } else {
//     res.json({ status: 'redirect' });
//   }
// });
// router.get('/order-success', async (req, res) => {
//   const user = req.session.user;
//   const cartCount = user ? await userHelpers.getCartCount(user._id) : null;
//   res.render('user/order-success', { cartCount });
// });
// router.get('/orders', verifyLogin, async (req, res) => {
//   const user = req.session.user!;
//   const cartCount = user ? await userHelpers.getCartCount(user._id) : null;
//   userHelpers.getOrders(user._id).then((response) => {
//     res.render('user/orders', { user, orders: response, cartCount });
//   });
// });
// router.get('/view-order-products/:orderId', verifyLogin, async (req, res) => {
//   const user = req.session.user;
//   const cartCount = user ? await userHelpers.getCartCount(user._id) : null;

//   const orderProducts = await userHelpers.getOrderProducts(req.params.orderId);
//   res.render('user/view-order-products', { user, orderProducts, cartCount });
// });
// router.post('/verify-payment', async (req, res) => {
//   // console.log("VERIFY:: ", req.body);
//   if (req.body) {
//     userHelpers
//       .verifyPayment(req.body)
//       .then(() => {
//         userHelpers.updatePaymentStatus(req.body['order[receipt]']).then(() => {
//           res.json({ status: true });
//         });
//       })
//       .catch(() => {
//         res.json({ status: false, errMsg: 'Payment failed' });
//       });
//   }
// });
// router.post('/pay-pending-orders', (req, res) => {
//   const user = req.session.user!;
//   const { orderId, amount, mobile } = req.body;
//   // console.log({ orderId, amount, mobile });
//   userHelpers.generateRazorpay(orderId, Number(amount)).then((order) => {
//     const userObj = { name: user.name, email: user.email, contact: mobile };
//     res.json({ status: 'online-pending', user: userObj, order });
//   });
// });

export default router;
