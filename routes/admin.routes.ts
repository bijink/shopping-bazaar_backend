import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { productHelpers } from '../helpers';
import { deleteFiles } from '../utils/deleteFiles';
import { validateRequest } from '../utils/middlewares';
import { productAddSchema } from '../utils/validationSchemas';

const router = Router();

router.post('/add-product', validateRequest(checkSchema(productAddSchema)), (request, response) => {
  productHelpers
    .addProduct(request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.delete('/delete-product/:id', (request, response) => {
  const prodId = request.params.id;
  productHelpers
    .deleteProduct(prodId)
    .then((res) => {
      const deletedProductImages = res.data.deletedProduct.images;
      deleteFiles(deletedProductImages)
        .then((deleteFilesRes) => {
          response.status(res.status).send({
            product: {
              message: res.data.message,
            },
            images: deleteFilesRes,
          });
        })
        .catch((deletedFilesErr) => {
          response.status(res.status).send({
            product: {
              message: res.data.message,
            },
            images: deletedFilesErr,
          });
        });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
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
router.patch('/edit-product/:id', (request, response) => {
  const prodId = request.params.id;
  productHelpers
    .updateProduct(prodId, request.body)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
// ?:
// router.get('/all-orders', verifyLogin, (req, res) => {
//   const admin = req.session.admin;
//   adminHelpers.getOrders().then((response) => {
//     res.render('admin/view-orders', { admin, orders: response });
//   });
// });
// router.get('/dispatch-order/:orderId', verifyLogin, (req, res) => {
//   const orderId = req.params.orderId;
//   adminHelpers.updateOrderStatus({ orderId, status: 'dispatched' }).then((response) => {
//     if (response.status) {
//       res.redirect('/admin/all-orders');
//     }
//   });
// });
// router.get('/delivered-order/:orderId', verifyLogin, (req, res) => {
//   const orderId = req.params.orderId;
//   adminHelpers.updateOrderStatus({ orderId, status: 'delivered' }).then((response) => {
//     if (response.status) {
//       res.redirect('/admin/all-orders');
//     }
//   });
// });
// router.get('/view-order-products/:orderId', verifyLogin, async (req, res) => {
//   const admin = req.session.admin;
//   const orderProducts = await adminHelpers.getOrderProducts(req.params.orderId);
//   res.render('admin/view-order-products', { admin, orderProducts });
// });
// router.get('/all-users', verifyLogin, async (req, res) => {
//   const admin = req.session.admin;
//   const usersList = await adminHelpers.getUsersList();
//   res.render('admin/view-users', { admin, users: usersList });
// });

export default router;
