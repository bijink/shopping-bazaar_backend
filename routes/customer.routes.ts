import { Router } from 'express';
import { customerHelpers } from '../helpers';

const router = Router();

router.post('/add-to-cart/:userId/:prodId', (req, res) => {
  const userId = req.params.userId;
  const prodId = req.params.prodId;
  // console.log("api called");
  // console.log(userId, prodId);
  // console.log(typeof userId, prodId);
  // res.sendStatus(200);
  customerHelpers
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
  customerHelpers
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
  customerHelpers
    .changeCartItemQuantity(userId, prodId, countNum)
    .then((response) => {
      // const cartTotalAmount = await customerHelpers.getCartTotalAmount(userId);
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});
router.get('/get-cart-products/:userId', (req, res) => {
  const { userId } = req.params;
  customerHelpers
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
  customerHelpers
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
  customerHelpers
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
//   const products = await customerHelpers.getCartProductList(user._id);
//   const totalAmount = await customerHelpers.getCartTotalAmount(user._id);
//   if (totalAmount) {
//     customerHelpers.placeOrder(user._id, req.body, products, totalAmount).then((response) => {
//       if (req.body.paymentMethod == 'cod') {
//         res.json({ status: 'cod-success' });
//       } else {
//         customerHelpers.generateRazorpay(response.orderId, response.amount).then((order) => {
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
//   const cartCount = user ? await customerHelpers.getCartCount(user._id) : null;
//   res.render('user/order-success', { cartCount });
// });
// router.get('/orders', verifyLogin, async (req, res) => {
//   const user = req.session.user!;
//   const cartCount = user ? await customerHelpers.getCartCount(user._id) : null;
//   customerHelpers.getOrders(user._id).then((response) => {
//     res.render('user/orders', { user, orders: response, cartCount });
//   });
// });
// router.get('/view-order-products/:orderId', verifyLogin, async (req, res) => {
//   const user = req.session.user;
//   const cartCount = user ? await customerHelpers.getCartCount(user._id) : null;

//   const orderProducts = await customerHelpers.getOrderProducts(req.params.orderId);
//   res.render('user/view-order-products', { user, orderProducts, cartCount });
// });
// router.post('/verify-payment', async (req, res) => {
//   // console.log("VERIFY:: ", req.body);
//   if (req.body) {
//     customerHelpers
//       .verifyPayment(req.body)
//       .then(() => {
//         customerHelpers.updatePaymentStatus(req.body['order[receipt]']).then(() => {
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
//   customerHelpers.generateRazorpay(orderId, Number(amount)).then((order) => {
//     const userObj = { name: user.name, email: user.email, contact: mobile };
//     res.json({ status: 'online-pending', user: userObj, order });
//   });
// });

export default router;
