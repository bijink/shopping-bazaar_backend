import bcrypt from 'bcrypt';
import { User } from '../mongoose/models';
// import Razorpay from 'razorpay';

// const instance = new Razorpay({
//   key_id: 'rzp_test_Yn82FeG4kWvrqt',
//   key_secret: 'Z13UBT39Tzl6csIbmEyaKUs2',
// });

const userHelpers = {
  doSignup: async (reqBody: { name: string; email: string; password: string }) => {
    try {
      reqBody.password = await bcrypt.hash(reqBody.password, 10);
      const user = new User(reqBody);
      await user.save();
      const insertedUser = await User.findById(user._id, 'name email').exec();
      return Promise.resolve({ user: insertedUser });
    } catch (error) {
      return Promise.reject();
    }
    // !:
    // return new Promise<any>(async (resolve, reject) => {
    //   reqBody.password = await bcrypt.hash(reqBody.password, 10);
    //   try {
    //     const user = new User(reqBody);
    //     await user.save();
    //     const insertedUser = await User.findById(user._id, 'name email').exec();
    //     resolve(insertedUser);
    //   } catch (err) {
    //     reject();
    //   }
    // });
    // return new Promise<any>(async (resolve) => {
    //   reqBody.password = await bcrypt.hash(reqBody.password, 10);
    //   const insertRes = await db.get().collection(collections.USER_COLLECTION).insertOne(reqBody);
    //   const user = await db
    //     .get()
    //     .collection(collections.USER_COLLECTION)
    //     .findOne({ _id: insertRes.insertedId });
    //   resolve({ user });
    // });
    // !:
  },
  doLogin: async (reqBody: { email: string; password: string }) => {
    try {
      const user = await User.findOne({ email: reqBody.email });
      let userAuthStatus = false;
      if (user) {
        await bcrypt.compare(reqBody.password, user.password).then((status) => {
          userAuthStatus = status;
        });
      } else {
        userAuthStatus = false;
      }
      if (userAuthStatus) {
        return Promise.resolve({ user });
      } else {
        return Promise.reject('Invalid email or password');
      }
    } catch (error) {
      return Promise.reject();
    }
  },
  // addToCart: (prodId: any, userId: any) => {
  //   // console.log(prodId, userId);
  //   const prodObj = {
  //     item: new ObjectId(prodId),
  //     quantity: 1,
  //   };
  //   return new Promise<any>(async (resolve) => {
  //     const userCart = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .findOne({ user: new ObjectId(userId) });
  //     if (userCart) {
  //       const prodExist = userCart.products.findIndex((prod: any) => prod.item == prodId);
  //       // console.log(prodExist);
  //       if (prodExist != -1) {
  //         db.get()
  //           .collection(collections.CART_COLLECTION)
  //           .updateOne(
  //             {
  //               user: new ObjectId(userId),
  //               'products.item': new ObjectId(prodId),
  //             },
  //             {
  //               $inc: { 'products.$.quantity': 1 },
  //             },
  //           )
  //           .then(() => {
  //             resolve({ status: false });
  //           });
  //       } else {
  //         db.get()
  //           .collection(collections.CART_COLLECTION)
  //           .updateOne({ user: new ObjectId(userId) }, { $push: { products: prodObj } })
  //           .then(() => {
  //             resolve({ status: true });
  //           });
  //       }
  //     } else {
  //       const cartObj = {
  //         user: new ObjectId(userId),
  //         products: [prodObj],
  //       };
  //       db.get()
  //         .collection(collections.CART_COLLECTION)
  //         .insertOne(cartObj)
  //         .then(() => {
  //           resolve({ status: true });
  //         });
  //     }
  //   });
  // },
  // getCartProducts: (userId: any) => {
  //   return new Promise(async (resolve) => {
  //     const cartItems = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .aggregate([
  //         {
  //           $match: { user: new ObjectId(userId) },
  //         },
  //         // {
  //         //   $lookup: {
  //         //     from: collections.PRODUCT_COLLECTION,
  //         //     const: { prodList: "$products" },
  //         //     pipeline: [
  //         //       {
  //         //         $match: { $expr: { $in: ["$_id", "$$prodList"] } },
  //         //       },
  //         //     ],
  //         //     as: "cartList",
  //         //   },
  //         // },
  //         {
  //           $unwind: '$products',
  //         },
  //         {
  //           $project: {
  //             // user: "$user",
  //             // #item means 'productId'
  //             item: '$products.item',
  //             quantity: '$products.quantity',
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: collections.PRODUCT_COLLECTION,
  //             localField: 'item',
  //             foreignField: '_id',
  //             as: 'product',
  //           },
  //         },
  //         // {
  //         //   $unwind: "$product",
  //         // },
  //         {
  //           $project: {
  //             item: 1,
  //             quantity: 1,
  //             product: { $arrayElemAt: ['$product', 0] },
  //           },
  //         },
  //       ])
  //       .toArray();
  //     // console.log(cartItems);
  //     resolve(cartItems);
  //   });
  // },
  // getCartCount: (userId: any) => {
  //   return new Promise(async (resolve) => {
  //     let count = 0;
  //     const cart = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .findOne({ user: new ObjectId(userId) });
  //     if (cart) count = cart.products.length;
  //     resolve(count);
  //   });
  // },
  // removeFromCart: (userId: any, cartId: any, prodId: any) => {
  //   return new Promise(async (resolve) => {
  //     const userCart = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .findOne({ user: new ObjectId(userId) });
  //     const productsLength = userCart.products.length;
  //     if (productsLength > 1) {
  //       db.get()
  //         .collection(collections.CART_COLLECTION)
  //         .updateOne(
  //           { _id: new ObjectId(cartId) },
  //           { $pull: { products: { item: new ObjectId(prodId) } } },
  //         )
  //         .then((res: any) => {
  //           resolve(res);
  //         });
  //     } else {
  //       db.get()
  //         .collection(collections.CART_COLLECTION)
  //         .deleteOne({ _id: new ObjectId(cartId) })
  //         .then((res: any) => {
  //           resolve(res);
  //         });
  //     }
  //   });
  // },
  // changeCartItemQuantity: (cartId: any, prodId: any, count: any) => {
  //   // console.log({ cartId, prodId, count });
  //   return new Promise<void>(async (resolve) => {
  //     db.get()
  //       .collection(collections.CART_COLLECTION)
  //       .updateOne(
  //         { _id: new ObjectId(cartId), 'products.item': new ObjectId(prodId) },
  //         {
  //           $inc: { 'products.$.quantity': count },
  //         },
  //       )
  //       .then(() => {
  //         resolve();
  //       });
  //   });
  // },
  // getCartTotalAmount: (userId: any) => {
  //   return new Promise(async (resolve) => {
  //     const totalAmount = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .aggregate([
  //         {
  //           $match: { user: new ObjectId(userId) },
  //         },
  //         {
  //           $unwind: '$products',
  //         },
  //         {
  //           $project: {
  //             // #item means 'productId'
  //             item: '$products.item',
  //             quantity: '$products.quantity',
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: collections.PRODUCT_COLLECTION,
  //             localField: 'item',
  //             foreignField: '_id',
  //             as: 'product',
  //           },
  //         },
  //         {
  //           $project: {
  //             item: 1,
  //             quantity: 1,
  //             product: { $arrayElemAt: ['$product', 0] },
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: null,
  //             total: {
  //               $sum: {
  //                 $multiply: ['$quantity', { $toInt: '$product.price' }],
  //               },
  //             },
  //           },
  //         },
  //       ])
  //       .toArray();
  //     // console.log(totalAmount[0]?.total);
  //     resolve(totalAmount[0]?.total);
  //   });
  // },
  // getCartProductList: (userId: any) => {
  //   return new Promise(async (resolve) => {
  //     const cart = await db
  //       .get()
  //       .collection(collections.CART_COLLECTION)
  //       .findOne({ user: new ObjectId(userId) });
  //     resolve(cart?.products);
  //   });
  // },
  // placeOrder: (userId: any, orderData: any, products: any, totalAmount: any) => {
  //   return new Promise<any>((resolve) => {
  //     // console.log(userId, orderData, products, totalAmount);
  //     const status = orderData.paymentMethod === 'cod' ? 'placed' : 'pending';
  //     const orderObj = {
  //       userId: new ObjectId(userId),
  //       deliveryDetails: {
  //         address: orderData.address,
  //         pincode: orderData.pincode,
  //         mobile: orderData.mobile,
  //       },
  //       products,
  //       totalAmount,
  //       paymentMethod: orderData.paymentMethod,
  //       status,
  //       date: new Date(),
  //     };
  //     db.get()
  //       .collection(collections.ORDER_COLLECTION)
  //       .insertOne(orderObj)
  //       .then((response: any) => {
  //         db.get()
  //           .collection(collections.CART_COLLECTION)
  //           .deleteOne({ user: new ObjectId(userId) });
  //         resolve({ orderId: response.insertedId, amount: totalAmount });
  //       });
  //   });
  // },
  // getOrders: (userId: any) => {
  //   return new Promise(async (resolve) => {
  //     db.get()
  //       .collection(collections.ORDER_COLLECTION)
  //       .find({ userId: new ObjectId(userId) })
  //       .sort({ date: -1 })
  //       .toArray()
  //       .then((res: any) => {
  //         resolve(res);
  //       });
  //   });
  // },
  // getOrderProducts: (orderId: any) => {
  //   return new Promise(async (resolve) => {
  //     const orderProducts = await db
  //       .get()
  //       .collection(collections.ORDER_COLLECTION)
  //       .aggregate([
  //         {
  //           $match: { _id: new ObjectId(orderId) },
  //         },
  //         {
  //           $unwind: '$products',
  //         },
  //         {
  //           $project: {
  //             // #item means 'productId'
  //             item: '$products.item',
  //             quantity: '$products.quantity',
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: collections.PRODUCT_COLLECTION,
  //             localField: 'item',
  //             foreignField: '_id',
  //             as: 'product',
  //           },
  //         },
  //         {
  //           $project: {
  //             item: 1,
  //             quantity: 1,
  //             product: { $arrayElemAt: ['$product', 0] },
  //           },
  //         },
  //       ])
  //       .toArray();
  //     // console.log(orderProducts);
  //     resolve(orderProducts);
  //   });
  // },
  // generateRazorpay: (orderId: any, amount: any) => {
  //   return new Promise((resolve, reject) => {
  //     // console.log(orderId.toString(), amount);
  //     instance.orders.create(
  //       {
  //         amount: amount * 100,
  //         currency: 'INR',
  //         receipt: orderId.toString(),
  //         // notes: {
  //         //   key1: "value3",
  //         //   key2: "value2",
  //         // },
  //       },
  //       (err, order) => {
  //         if (!err) {
  //           // console.log("generateRazorpay_RES", order);
  //           resolve(order);
  //         } else {
  //           // console.log("generateRazorpay_ERR", err);
  //           reject();
  //         }
  //       },
  //     );
  //   });
  // },
  // verifyPayment: (orderDetails: any) => {
  //   return new Promise<void>((resolve, reject) => {
  //     const { createHmac } = require('node:crypto');
  //     const secret = 'Z13UBT39Tzl6csIbmEyaKUs2';
  //     const hash = createHmac('sha256', secret)
  //       .update(
  //         orderDetails['payment[razorpay_order_id]'] +
  //           '|' +
  //           orderDetails['payment[razorpay_payment_id]'],
  //       )
  //       .digest('hex');
  //     // console.log(hash);
  //     // generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
  //     if (hash == orderDetails['payment[razorpay_signature]']) {
  //       resolve();
  //     } else {
  //       reject();
  //     }
  //   });
  // },
  // updatePaymentStatus: (orderId: any) => {
  //   return new Promise<void>((resolve) => {
  //     db.get()
  //       .collection(collections.ORDER_COLLECTION)
  //       .updateOne({ _id: new ObjectId(orderId) }, { $set: { status: 'placed' } })
  //       .then(() => {
  //         resolve();
  //       });
  //   });
  // },
};

export default userHelpers;
