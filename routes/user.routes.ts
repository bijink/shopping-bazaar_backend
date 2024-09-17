import { Router } from 'express';
import { productHelpers, userHelpers } from '../helpers';
import { authenticateJwtToken } from '../utils/middlewares';

const router = Router();

router.patch('/update-details/:userId', authenticateJwtToken, (request, response) => {
  const { userId } = request.params;
  userHelpers
    .updateUserDetails(userId, request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// router.patch('/delete/:userId', (request, response) => {
//   const { userId } = request.params;
// });
router.get('/get-product', async (request, response) => {
  const prodId = request.query.id;
  if (prodId) {
    productHelpers
      .getProduct(prodId)
      .then((res) => {
        response.status(res.status).send(res.data);
      })
      .catch((err) => {
        response.status(err.status).send(err.data);
      });
  } else {
    response.status(400).send('product id required');
  }
});
router.get('/get-all-product', async (request, response) => {
  productHelpers
    .getAllProduct()
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});

export default router;
