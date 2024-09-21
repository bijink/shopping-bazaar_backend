import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { customerHelpers } from '../helpers';
import { validateRequest } from '../utils/middlewares';
import { cartAddSchema } from '../utils/validationSchemas';

const router = Router();

router.post(
  '/add-to-cart/:userId/:prodId',
  validateRequest(checkSchema(cartAddSchema)),
  (request, response) => {
    const { userId, prodId } = request.params;
    customerHelpers
      .addToCart(userId, prodId, request.body)
      .then((res) => {
        response.status(res.status).send(res.data);
      })
      .catch((err) => {
        response.status(err.status).send(err.data);
      });
  },
);
router.get('/get-cart-items/:userId', (request, response) => {
  const { userId } = request.params;
  customerHelpers
    .getCartItems(userId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.delete('/remove-from-cart', (request, response) => {
  const { userId, cartItemId } = request.query;
  customerHelpers
    .removeFromCart(userId, cartItemId)
    .then((res) => {
      response.sendStatus(res.status);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.delete('/remove-cart/:userId', (request, response) => {
  const { userId } = request.params;
  customerHelpers
    .removeCart(userId)
    .then((res) => {
      response.sendStatus(res.status);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.get('/get-cart-count/:userId', (request, response) => {
  const { userId } = request.params;
  customerHelpers
    .getCartCount(userId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.get('/get-cart-amount/:userId', (request, response) => {
  const { userId } = request.params;
  customerHelpers
    .getCartTotalAmount(userId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.patch('/change-cart-item-quantity', (request, response) => {
  const { userId, cartItemId, count } = request.query;
  const countNum = Number(count);
  customerHelpers
    .changeCartItemQuantity(userId, cartItemId, countNum)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
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
