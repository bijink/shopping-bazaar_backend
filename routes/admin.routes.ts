import { Router } from 'express';
import { productHelpers } from '../helpers';

const router = Router();

// const verifyLogin = (req, res, next) => {
//   if (req.session.loggedIn === 'admin') {
//     next();
//   } else {
//     res.redirect('/admin/login');
//   }
// };
router.post('/product-add', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image);
  // productHelpers.addProduct(req.body, (id) => {
  //   console.log("ID:: ", id);
  //   const image = req.files.Image;
  //   Add image
  //   image.mv('./public/images/product-images/' + id + '.png', (err, done) => {
  //     if (!err) res.render('admin/add-product', { admin: true });
  //     else console.log(err);
  //   });
  // });
  productHelpers
    .addProduct(req.body)
    .then((respose) => {
      res.status(200).send(respose.product);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});
router.delete('/product-delete/:id', (req, res) => {
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
router.get('/product-get', async (req, res) => {
  const prodId = req.query.id;
  if (prodId) {
    productHelpers
      .getProduct(prodId)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(() => {
        res.sendStatus(400);
      });
  } else {
    res.status(400).send('Product ID required');
  }
});
router.get('/product-get-all', async (req, res) => {
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
router.patch('/product-edit/:id', (req, res) => {
  const prodId = req.params.id;
  productHelpers
    .updateProduct(prodId, req.body)
    .then((response) => {
      // const image = req.files.Image;
      // if (image) {
      //   image.mv('./public/images/product-images/' + prodId + '.png');
      // }
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
