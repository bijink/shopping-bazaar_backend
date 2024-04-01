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
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (userCart) {
        db.get()
          .collection(collections.CART_COLLECTION)
          .updateOne({ user: new ObjectId(userId) }, { $push: { products: new ObjectId(prodId) } })
          .then(() => {
            resolve();
          });
      } else {
        let cartObj = {
          user: new ObjectId(userId),
          products: [new ObjectId(prodId)],
        };
        db.get()
          .collection(collections.CART_COLLECTION)
          .insertOne(cartObj)
          .then(() => {
            resolve();
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
          {
            $lookup: {
              from: collections.PRODUCT_COLLECTION,
              let: { prodList: "$products" },
              pipeline: [
                {
                  $match: { $expr: { $in: ["$_id", "$$prodList"] } },
                },
              ],
              as: "cartList",
            },
          },
        ])
        .toArray();
      resolve(cartItems[0]?.cartList);
    });
  },
};
