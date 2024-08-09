// import Razorpay from 'razorpay';
import { Types } from 'mongoose';
import { ParsedQs } from 'qs';
import { Cart, Product } from '../mongoose/models';

// const instance = new Razorpay({
//   key_id: 'rzp_test_Yn82FeG4kWvrqt',
//   key_secret: 'Z13UBT39Tzl6csIbmEyaKUs2',
// });

const customerHelpers = {
  // #if no cart, add new cart doc | if cart doc exist & (item not exist, add item | item exist, increment cart quantity)
  addToCart: async (userId: string, prodId: string) => {
    const prodObj = {
      item: new Types.ObjectId(prodId),
      quantity: 1,
    };
    try {
      // Find the product
      const product = await Product.findById(prodId);
      if (!product) return Promise.reject({ message: 'Product not found' });
      // Find the cart for the user
      let cart = await Cart.findOne({ user_id: userId });
      // If no cart exists, create a new one
      if (!cart) {
        cart = new Cart({ user_id: userId, products: [prodObj] });
      } else {
        // Add the product to the cart
        const prodIndex = cart.products.findIndex((prod) => prod.item.toString() === prodId);
        if (prodIndex > -1) {
          cart.products[prodIndex].quantity += 1;
        } else {
          cart.products.push(prodObj);
        }
      }
      await cart.save();
      return Promise.resolve(cart);
    } catch (error) {
      return Promise.reject({ message: error });
    }
  },
  getCartProducts: async (userId: string) => {
    try {
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) return Promise.reject({ message: 'Cart is empty' });
      const cartProducts = await Cart.aggregate([
        { $match: { user_id: new Types.ObjectId(userId) } },
        { $unwind: '$products' },
        {
          $project: {
            user_id: '$user_id',
            product_id: '$products.item',
            quantity: '$products.quantity',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'products',
          },
        },
        { $addFields: { products: { quantity: '$quantity' } } },
        {
          $group: {
            _id: '$_id',
            user_id: { $first: '$user_id' },
            products: { $push: { $arrayElemAt: ['$products', 0] } },
          },
        },
      ]);
      // return Promise.resolve(cartProducts[0]);
      return Promise.resolve(cartProducts[0].products);
    } catch (error) {
      return Promise.reject({ message: error });
    }
  },
  getCartCount: async (userId: string) => {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) return Promise.reject({ message: 'Cart not found' });
      return Promise.resolve({
        _id: cart._id,
        user_id: userId,
        cartCount: cart.products.length,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  removeFromCart: async (userId: ParsedQs[string], prodId: ParsedQs[string]) => {
    try {
      const product = await Product.findById(prodId);
      if (!product) return Promise.reject({ message: 'Product not exist' });
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) return Promise.reject({ message: 'Cart is empty' });
      const prodIndex = userCart.products.findIndex((prod) => prod.item.toString() === prodId);
      if (prodIndex <= -1) return Promise.reject({ message: 'Product not found in cart' });
      const productsLength = userCart.products.length;
      if (productsLength > 1) {
        await Cart.updateOne({ user_id: userId }, { $pull: { products: { item: prodId } } });
        const updatedUserCart = await Cart.findOne({ user_id: userId });
        return Promise.resolve(updatedUserCart);
      } else {
        await Cart.findOneAndDelete({ user_id: userId });
        return Promise.resolve({ message: 'Last product deleted. Cart is empty now' });
      }
    } catch (error) {
      return Promise.reject();
    }
  },
  changeCartItemQuantity: async (
    userId: ParsedQs[string],
    prodId: ParsedQs[string],
    count: number,
  ) => {
    try {
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) return Promise.reject({ message: 'Cart is empty' });
      const prodIndex = userCart.products.findIndex((prod) => prod.item.toString() === prodId);
      if (prodIndex <= -1) return Promise.reject({ message: 'Product not found in cart' });
      const productsLength = userCart.products.length;
      const prodQuantity = userCart.products[prodIndex].quantity;
      if (productsLength < 2 && prodQuantity < 2 && count < 0) {
        await Cart.findOneAndDelete({ user_id: userId });
        return Promise.resolve({ message: 'Last product deleted. Cart is empty now' });
      }
      if (prodQuantity < 2 && count < 0) {
        await Cart.updateOne({ user_id: userId }, { $pull: { products: { item: prodId } } });
        const updatedUserCart = await Cart.findOne({ user_id: userId });
        return Promise.resolve(updatedUserCart);
      }
      await Cart.updateOne(
        { user_id: userId, 'products.item': prodId },
        {
          $inc: { 'products.$.quantity': count },
        },
      );
      const updatedUserCart = await Cart.findOne({ user_id: userId });
      return Promise.resolve(updatedUserCart);
    } catch (error) {
      return Promise.reject({ message: error });
    }
  },
  getCartTotalAmount: async (userId: string) => {
    try {
      const totalAmount = await Cart.aggregate([
        { $match: { user_id: new Types.ObjectId(userId) } },
        { $unwind: '$products' },
        {
          $project: {
            // #item means 'productId'
            user_id: '$user_id',
            item: '$products.item',
            quantity: '$products.quantity',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $project: {
            user_id: 1,
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ['$product', 0] },
          },
        },
        {
          $group: {
            _id: '$_id',
            user_id: { $first: '$user_id' },
            total_amount: { $sum: { $multiply: ['$quantity', { $toInt: '$product.price' }] } },
          },
        },
        { $addFields: { unit: 'rupees' } },
      ]);
      return Promise.resolve(totalAmount[0]);
    } catch (error) {
      return Promise.reject({ message: error });
    }
  },
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

export default customerHelpers;
