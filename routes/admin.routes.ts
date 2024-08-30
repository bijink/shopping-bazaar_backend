import { Router } from 'express';
import { productHelpers } from '../helpers';

const router = Router();

router.post('/add-product', (req, res) => {
  productHelpers
    .addProduct(req.body)
    .then((respose) => {
      res.status(200).send(respose.product);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});
router.delete('/delete-product/:id', (req, res) => {
  const prodId = req.params.id;
  productHelpers
    .deleteProduct(prodId)
    .then(() => {
      // console.log('DEL RES:', response);
      // Delete the file
      // fs.unlink('./public/images/product-images/' + prodId + '.png', (err) => {
      //   if (!err) res.redirect('/admin');
      //   else console.log(err);
      // });
      res.status(200).send('Product deleted');
    })
    .catch((error) => {
      res.status(400).send(error);
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
router.get('/get-all-product', async (req, res) => {
  // console.log(res.locals.user);
  productHelpers
    .getAllProduct()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});
router.patch('/edit-product/:id', (req, res) => {
  const prodId = req.params.id;
  productHelpers
    .updateProduct(prodId, req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(() => {
      res.sendStatus(400);
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
