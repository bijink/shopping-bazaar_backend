var db = require("../config/connection");
import collections from "../mongodb/collections";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: "rzp_test_Yn82FeG4kWvrqt",
  key_secret: "Z13UBT39Tzl6csIbmEyaKUs2",
});

const userHelpers = {
  doSignup: async (userData: any) => {
    return new Promise<any>(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      let insertRes = await db.get().collection(collections.USER_COLLECTION).insertOne(userData);
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ _id: insertRes.insertedId });
      resolve({ user });
    });
    // return new Promise<any>(async (resolve, reject) => {
    //   userData.password = await bcrypt.hash(userData.password, 10);
    //   let insertRes = await db.get().collection(collections.USER_COLLECTION).insertOne(userData);
    //   let user = await db
    //     .get()
    //     .collection(collections.USER_COLLECTION)
    //     .findOne({ _id: insertRes.insertedId });
    //   resolve({ user });
    // });
  },
  doLogin: (userData: any) => {
    return new Promise<any>(async (resolve, reject) => {
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
  addToCart: (prodId: any, userId: any) => {
    // console.log(prodId, userId);
    let prodObj = {
      item: new ObjectId(prodId),
      quantity: 1,
    };
    return new Promise<any>(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      if (userCart) {
        let prodExist = userCart.products.findIndex((prod: any) => prod.item == prodId);
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
  getCartProducts: (userId: any) => {
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
  getCartCount: (userId: any) => {
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
  removeFromCart: (userId: any, cartId: any, prodId: any) => {
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
          .then((res: any) => {
            resolve(res);
          });
      } else {
        db.get()
          .collection(collections.CART_COLLECTION)
          .deleteOne({ _id: new ObjectId(cartId) })
          .then((res: any) => {
            resolve(res);
          });
      }
    });
  },
  changeCartItemQuantity: (cartId: any, prodId: any, count: any) => {
    // console.log({ cartId, prodId, count });
    return new Promise<void>(async (resolve, reject) => {
      db.get()
        .collection(collections.CART_COLLECTION)
        .updateOne(
          { _id: new ObjectId(cartId), "products.item": new ObjectId(prodId) },
          {
            $inc: { "products.$.quantity": count },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },
  getCartTotalAmount: (userId: any) => {
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
  getCartProductList: (userId: any) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .findOne({ user: new ObjectId(userId) });
      resolve(cart?.products);
    });
  },
  placeOrder: (userId: any, orderData: any, products: any, totalAmount: any) => {
    return new Promise<any>((resolve, reject) => {
      // console.log(userId, orderData, products, totalAmount);
      let status = orderData.paymentMethod === "cod" ? "placed" : "pending";
      let orderObj = {
        userId: new ObjectId(userId),
        deliveryDetails: {
          address: orderData.address,
          pincode: orderData.pincode,
          mobile: orderData.mobile,
        },
        products,
        totalAmount,
        paymentMethod: orderData.paymentMethod,
        status,
        date: new Date(),
      };
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .insertOne(orderObj)
        .then((response: any) => {
          db.get()
            .collection(collections.CART_COLLECTION)
            .deleteOne({ user: new ObjectId(userId) });
          resolve({ orderId: response.insertedId, amount: totalAmount });
        });
    });
  },
  getOrders: (userId: any) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .find({ userId: new ObjectId(userId) })
        .sort({ date: -1 })
        .toArray()
        .then((res: any) => {
          resolve(res);
        });
    });
  },
  getOrderProducts: (orderId: any) => {
    return new Promise(async (resolve, reject) => {
      let orderProducts = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: new ObjectId(orderId) },
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
        ])
        .toArray();
      // console.log(orderProducts);
      resolve(orderProducts);
    });
  },
  generateRazorpay: (orderId: any, amount: any) => {
    return new Promise((resolve, reject) => {
      // console.log(orderId.toString(), amount);
      instance.orders.create(
        {
          amount: amount * 100,
          currency: "INR",
          receipt: orderId.toString(),
          // notes: {
          //   key1: "value3",
          //   key2: "value2",
          // },
        },
        (err, order) => {
          if (!err) {
            // console.log("generateRazorpay_RES", order);
            resolve(order);
          } else {
            // console.log("generateRazorpay_ERR", err);
            reject();
          }
        }
      );
    });
  },
  verifyPayment: (orderDetails: any) => {
    return new Promise<void>((resolve, reject) => {
      const { createHmac } = require("node:crypto");
      const secret = "Z13UBT39Tzl6csIbmEyaKUs2";
      const hash = createHmac("sha256", secret)
        .update(
          orderDetails["payment[razorpay_order_id]"] +
            "|" +
            orderDetails["payment[razorpay_payment_id]"]
        )
        .digest("hex");
      // console.log(hash);
      // generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
      if (hash == orderDetails["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  updatePaymentStatus: (orderId: any) => {
    return new Promise<void>((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne({ _id: new ObjectId(orderId) }, { $set: { status: "placed" } })
        .then(() => {
          resolve();
        });
    });
  },
};

export default userHelpers;
