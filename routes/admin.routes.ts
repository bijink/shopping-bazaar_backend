const express = require('express');
const router = express.Router();
const fs = require('fs');
const productHelpers = require('../helpers/product-helpers');
const adminHelpers = require('../helpers/admin-helpers');

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn === 'admin') {
    next();
  } else {
    res.redirect('/admin/login');
  }
};
// #here root url is "/admin/"
// #here "/" represent "/admin/" in browser
router.get('/', verifyLogin, function (req, res, next) {
  if (req.session.loggedIn === 'admin') {
    productHelpers.getAllProducts().then((products) => {
      // console.log("PRODUCTS:: ", products);
      res.render('admin/view-products', { products, admin: true });
    });
  } else {
    res.redirect('/admin/login');
  }
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn === 'admin') {
    res.redirect('/admin');
  } else {
    res.render('admin/login', { loginErr: req.session.adminLoginErr });
    req.session.adminLoginErr = false;
  }
});
router.post('/login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    // console.log("RESULT:: ", response);
    if (response.status) {
      req.session.admin = response.admin;
      req.session.loggedIn = 'admin';
      res.redirect('/admin');
    } else {
      req.session.adminLoginErr = 'Invalid email or password';
      res.redirect('/admin/login');
    }
  });
});
router.get('/logout', (req, res) => {
  req.session.admin = null;
  req.session.loggedIn = null;
  res.redirect('/');
});
router.get('/add-product', verifyLogin, (req, res, next) => {
  res.render('admin/add-product', { admin: true });
});
router.post('/add-product', (req, res) => {
  // console.log(req.body);
  // console.log(req.files.Image);
  productHelpers.addProduct(req.body, (id) => {
    // console.log("ID:: ", id);
    const image = req.files.Image;
    // Add image
    image.mv('./public/images/product-images/' + id + '.png', (err, done) => {
      if (!err) res.render('admin/add-product', { admin: true });
      else console.log(err);
    });
  });
});
router.get('/delete-product/:id', verifyLogin, (req, res) => {
  const prodId = req.params.id;
  // console.log(prodId);
  productHelpers.deleteProduct(prodId).then((response) => {
    console.log(response);
    // Delete the file
    fs.unlink('./public/images/product-images/' + prodId + '.png', (err) => {
      if (!err) res.redirect('/admin');
      else console.log(err);
    });
  });
});
router.get('/edit-product', verifyLogin, async (req, res, next) => {
  const prodId = req.query.id;
  const product = await productHelpers.getProductDetails(prodId);
  // console.log(product);
  res.render('admin/edit-product', { admin: true, product });
});
router.post('/edit-product/:id', (req, res) => {
  const prodId = req.params.id;
  productHelpers.updateProduct(prodId, req.body).then(() => {
    res.redirect('/admin');
    const image = req.files.Image;
    if (image) {
      image.mv('./public/images/product-images/' + prodId + '.png');
    }
  });
});
router.get('/all-orders', verifyLogin, (req, res) => {
  const admin = req.session.admin;
  adminHelpers.getOrders().then((response) => {
    res.render('admin/view-orders', { admin, orders: response });
  });
});
router.get('/dispatch-order/:orderId', verifyLogin, (req, res) => {
  const orderId = req.params.orderId;
  adminHelpers.updateOrderStatus({ orderId, status: 'dispatched' }).then((response) => {
    if (response.status) {
      res.redirect('/admin/all-orders');
    }
  });
});
router.get('/delivered-order/:orderId', verifyLogin, (req, res) => {
  const orderId = req.params.orderId;
  adminHelpers.updateOrderStatus({ orderId, status: 'delivered' }).then((response) => {
    if (response.status) {
      res.redirect('/admin/all-orders');
    }
  });
});
router.get('/view-order-products/:orderId', verifyLogin, async (req, res) => {
  const admin = req.session.admin;
  const orderProducts = await adminHelpers.getOrderProducts(req.params.orderId);
  res.render('admin/view-order-products', { admin, orderProducts });
});
router.get('/all-users', verifyLogin, async (req, res) => {
  const admin = req.session.admin;
  const usersList = await adminHelpers.getUsersList();
  res.render('admin/view-users', { admin, users: usersList });
});

export default router;
