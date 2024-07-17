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
router.post('/add-to-cart/:userId/:prodId', (req, res) => {
  const userId = req.params.userId;
  const prodId = req.params.prodId;
  // console.log("api called");
  // console.log(userId, prodId);
  // console.log(typeof userId, prodId);
  // res.sendStatus(200);
  userHelpers
    .addToCart(userId, prodId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.delete('/remove-from-cart', (req, res) => {
  const { userId, prodId } = req.query;
  userHelpers
    .removeFromCart(userId, prodId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.patch('/change-cart-item-quantity', (req, res) => {
  const { userId, prodId, count } = req.query;
  const countNum = Number(count);
  userHelpers
    .changeCartItemQuantity(userId, prodId, countNum)
    .then((response) => {
      // const cartTotalAmount = await userHelpers.getCartTotalAmount(userId);
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.get('/get-cart-products/:userId', (req, res) => {
  const { userId } = req.params;
  userHelpers
    .getCartProducts(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.get('/get-cart-count/:userId', (req, res) => {
  const { userId } = req.params;
  userHelpers
    .getCartCount(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.get('/get-cart-amount/:userId', (req, res) => {
  const { userId } = req.params;
  userHelpers
    .getCartTotalAmount(userId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
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
