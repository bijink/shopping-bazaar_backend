import { Router } from 'express';
import { adminHelpers, productHelpers } from '../helpers';
import { Admin } from '../mongoose/models';
import bcrypt from 'bcrypt';
// const fs = require('fs');

const router = Router();

// !: for dev
router.post('/add-super-admin', async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin(req.body);
    await admin.save();
    const insertedAdmin = await Admin.findById(admin._id, 'name email').exec();
    res.status(200).send(insertedAdmin);
  } catch (error) {
    res.sendStatus(400);
  }
});
// !: for dev

// const verifyLogin = (req, res, next) => {
//   if (req.session.loggedIn === 'admin') {
//     next();
//   } else {
//     res.redirect('/admin/login');
//   }
// };
router.post('/login', (req, res) => {
  adminHelpers
    .doLogin(req.body)
    .then((response) => {
      // console.log('RESULT:: ', response);
      // req.session.admin = response.admin;
      // req.session.loggedIn = 'admin';
      res.status(200).send(response);
    })
    .catch((err) => {
      // console.log('Err', err);
      res.status(400).send(err);
    });
});
router.post('/add-product', (req, res) => {
  // console.log(req.body);
  productHelpers
    .addProduct(req.body)
    .then((respose) => {
      res.status(200).send(respose.product);
    })
    .catch(() => {
      res.sendStatus(400);
    });
  // !:
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
  // !:
});
// router.get('/delete-product/:id', verifyLogin, (req, res) => {
//   const prodId = req.params.id;
//   // console.log(prodId);
//   productHelpers.deleteProduct(prodId).then((response) => {
//     console.log(response);
//     // Delete the file
//     fs.unlink('./public/images/product-images/' + prodId + '.png', (err) => {
//       if (!err) res.redirect('/admin');
//       else console.log(err);
//     });
//   });
// });
// router.get('/edit-product', verifyLogin, async (req, res, next) => {
//   const prodId = req.query.id;
//   const product = await productHelpers.getProductDetails(prodId);
//   // console.log(product);
//   res.render('admin/edit-product', { admin: true, product });
// });
// router.post('/edit-product/:id', (req, res) => {
//   const prodId = req.params.id;
//   productHelpers.updateProduct(prodId, req.body).then(() => {
//     res.redirect('/admin');
//     const image = req.files.Image;
//     if (image) {
//       image.mv('./public/images/product-images/' + prodId + '.png');
//     }
//   });
// });
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
