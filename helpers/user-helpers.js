var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

module.exports = {
  doSignup: userData => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      let insertRes = await db.get().collection(collections.USER_COLLECTION).insertOne(userData);
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ _id: insertRes.insertedId });
      resolve({ user });
    });
  },
  doLogin: userData => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then(status => {
          if (status) {
            console.log("Login success");
            resolve({ user: user, status: true });
          } else {
            console.log("Login failed");
            resolve({ user: null, status: false });
          }
        });
      } else {
        console.log("Login failed");
        resolve({ user: null, status: false });
      }
    });
  },
  addToCart: (prodId, userId) => {
    // console.log(prodId, userId);
    let prodObj = {
      item: new ObjectId(prodId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (userCart) {
        let prodExist = userCart.products.findIndex(prod => prod.item == prodId);
        // console.log(prodExist);
        if (prodExist != -1) {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne(
              { user: new ObjectId(userId), "products.item": new ObjectId(prodId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve({ status: false });
            });
        } else {
          db.get()
            .collection(collections.CART_COLLECTION)
            .updateOne({ user: new ObjectId(userId) }, { $push: { products: prodObj } })
            .then(() => {
              resolve({ status: true });
            });
        }
      } else {
        let cartObj = {
          user: new ObjectId(userId),
          products: [prodObj],
        };
        db.get()
          .collection(collections.CART_COLLECTION)
          .insertOne(cartObj)
          .then(() => {
            resolve({ status: true });
          });
      }
    });
  },
  getCartProducts: userId => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          // {
          //   $lookup: {
          //     from: collections.PRODUCT_COLLECTION,
          //     let: { prodList: "$products" },
          //     pipeline: [
          //       {
          //         $match: { $expr: { $in: ["$_id", "$$prodList"] } },
          //       },
          //     ],
          //     as: "cartList",
          //   },
          // },
          {
            $unwind: "$products",
          },
          {
            $project: {
              // user: "$user",
              // #item means 'productId'
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          // {
          //   $unwind: "$product",
          // },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      // console.log(cartItems);
      resolve(cartItems);
    });
  },
  getCartCount: userId => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (cart) count = cart.products.length;
      resolve(count);
    });
  },
  removeFromCart: (userId, cartId, prodId) => {
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      let productsLength = userCart.products.length;
      if (productsLength > 1) {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne(
            { _id: new ObjectId(cartId) },
            { $pull: { products: { item: new ObjectId(prodId) } } }
          )
          .then(res => {
            resolve(res);
          });
      } else {
        db.get()
          .collection(collections.CART_COLLECTION)
          .deleteOne({ _id: new ObjectId(cartId) })
          .then(res => {
            resolve(res);
          });
      }
    });
  },
  changeCartItemQuantity: (cartId, prodId, quantity, count) => {
    // console.log({ cartId, prodId, quantity, count });
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: new ObjectId(cartId), "products.item": new ObjectId(prodId) },
          {
            $inc: { "products.$.quantity": count },
          }
        )
        .then(response => {
          resolve({ count });
        });
    });
  },
  getTotalAmount: userId => {
    return new Promise(async (resolve, reject) => {
      let totalAmount = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: new ObjectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              // #item means 'productId'
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", { $toInt: "$product.price" }] } },
            },
          },
        ])
        .toArray();
      // console.log(totalAmount[0]?.total);
      resolve(totalAmount[0]?.total);
    });
  },
};
