import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { customerHelpers, orderHelpers } from '../helpers';
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
  orderHelpers
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
  orderHelpers
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
  orderHelpers
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
  orderHelpers
    .updateOrder(orderId, request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// router.delete('/delete-order/:orderId', (request, response) => {
//   const { orderId } = request.params;
//   orderHelpers
//     .deleteOrder(orderId)
//     .then((res) => {
//       response.status(res.status).send(res.data);
//     })
//     .catch((err) => {
//       response.status(err.status).send(err.data);
//     });
// });
router.get('/get-orders/:userId', (request, response) => {
  const { userId } = request.params;
  orderHelpers
    .getUserOrders(userId)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.patch('/cancel-order/:orderId', (request, response) => {
  const { orderId } = request.params;
  orderHelpers
    .updateOrder(orderId, { orderStatus: 'cancelled' })
    .then((res) => {
      response.status(res.status).send({ message: 'order cancelled' });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// router.get('/get-order-products/:orderId', (request, response) => {
//   const { orderId } = request.params;
//   orderHelpers
//     .getOrderProducts(orderId)
//     .then((res) => {
//       response.status(res.status).send(res.data);
//     })
//     .catch((err) => {
//       response.status(err.status).send(err.data);
//     });
// });

export default router;
