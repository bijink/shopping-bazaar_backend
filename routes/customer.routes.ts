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
router.post('/generate-rzp-order/:userId', async (request, response) => {
  const { userId } = request.params;
  const totalAmount = await customerHelpers
    .getCartTotalAmount(userId)
    .then((res) => res.data.total_amount);
  customerHelpers
    .generateRazorpay(userId, totalAmount)
    .then((res) => {
      response.status(res.status).send({
        message: 'order placed (POL)',
        paymentOrder: res.data,
      });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.post('/verify-payment', (request, response) => {
  customerHelpers
    .verifyPayment(request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.post('/place-order/:userId', async (request, response) => {
  const { userId } = request.params;
  const totalAmount = await customerHelpers
    .getCartTotalAmount(userId)
    .then((res) => res.data.total_amount);
  customerHelpers
    .placeOrder(userId, request.body, totalAmount)
    .then((res) => {
      response.status(res.status).send({ message: 'order placed' });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.patch('/update-order/:orderId', (request, response) => {
  const { orderId } = request.params;
  customerHelpers
    .updateOrder(orderId, request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.delete('/delete-order/:orderId', (request, response) => {
  const { orderId } = request.params;
  customerHelpers
    .deleteOrder(orderId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.get('/get-orders/:userId', (request, response) => {
  const { userId } = request.params;
  customerHelpers
    .getOrders(userId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.patch('/cancel-order/:orderId', (request, response) => {
  const { orderId } = request.params;
  customerHelpers
    .updateOrder(orderId, { orderStatus: 'cancelled', deliveryStatus: 'cancelled' })
    .then((res) => {
      response.status(res.status).send({ message: 'order cancelled' });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// router.get('/get-order-products/:orderId', (request, response) => {
//   const { orderId } = request.params;
//   customerHelpers
//     .getOrderProducts(orderId)
//     .then((res) => {
//       response.status(res.status).send(res.data);
//     })
//     .catch((err) => {
//       response.status(err.status).send(err.data);
//     });
// });

// router.get('/view-order-products/:orderId', verifyLogin, async (req, res) => {
//   const user = req.session.user;
//   const cartCount = user ? await customerHelpers.getCartCount(user._id) : null;

//   const orderProducts = await customerHelpers.getOrderProducts(req.params.orderId);
//   res.render('user/view-order-products', { user, orderProducts, cartCount });
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
