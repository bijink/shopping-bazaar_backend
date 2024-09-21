// import Razorpay from 'razorpay';
import { Types } from 'mongoose';
import { ParsedQs } from 'qs';
import { Cart, Product, User } from '../mongoose/models';

const customerHelpers = {
  // #if no cart, add new cart doc | if cart doc exist & (product not exist, add product | product exist, increment cart quantity)
  addToCart: async (
    userId: string,
    prodId: string,
    item: {
      color: { name: string; hex: string };
      size: string;
    },
  ) => {
    const prodObj = {
      product_id: new Types.ObjectId(prodId),
      quantity: 1,
      color: item.color,
      size: item.size,
    };
    try {
      // Find the product
      const user = await User.findById(userId);
      if (!user) return Promise.reject({ status: 404, data: { message: 'user not found' } });
      const product = await Product.findById(prodId);
      if (!product) return Promise.reject({ status: 404, data: { message: 'product not found' } });
      // Find the cart for the user
      let cart = await Cart.findOne({ user_id: userId });
      // If no cart exists, create a new one
      if (!cart) {
        cart = new Cart({ user_id: userId, items: [prodObj] });
      } else {
        // Add the product to the cart
        const itemIndex = cart.items.findIndex(
          (item) =>
            item.product_id.toString() === prodId &&
            item.color.hex === prodObj.color.hex &&
            item.size === prodObj.size,
        );
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
          cart.items[itemIndex].color.name = prodObj.color.name;
        } else {
          cart.items.push(prodObj);
        }
      }
      await cart.save();
      return Promise.resolve({
        status: 200,
        data: { message: 'successfully added product to cart', cart },
      });
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  getCartItems: async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) return Promise.reject({ status: 404, data: { message: 'user not found' } });
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart)
        return Promise.resolve({ status: 200, data: { items: null, message: 'cart is empty' } });
      const cart = await Cart.aggregate([
        { $match: { user_id: new Types.ObjectId(userId) } },
        { $unwind: '$items' },
        {
          $project: {
            user_id: '$user_id',
            item_id: '$items._id',
            product_id: '$items.product_id',
            quantity: '$items.quantity',
            color: '$items.color',
            size: '$items.size',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'items',
          },
        },
        {
          $addFields: {
            image: {
              $arrayElemAt: [
                {
                  $arrayElemAt: ['$items.images', 0],
                },
                0,
              ],
            },
          },
        },
        {
          $unset: ['color._id', 'items.colors', 'items.sizes', 'items.images', 'items._id'],
        },
        {
          $addFields: {
            items: {
              _id: '$item_id',
              product_id: '$product_id',
              color: '$color',
              size: '$size',
              image: '$image',
              quantity: '$quantity',
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            user_id: {
              $first: '$user_id',
            },
            items: {
              $push: {
                $arrayElemAt: ['$items', 0],
              },
            },
          },
        },
      ]);
      return Promise.resolve({ status: 200, data: { items: cart[0].items } });
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  removeFromCart: async (userId: ParsedQs[string], cartItemId: ParsedQs[string]) => {
    try {
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) return Promise.reject({ status: 404, data: { message: 'cart is empty' } });
      const itemIndex = userCart.items.findIndex((item) => item._id?.toString() === cartItemId);
      if (itemIndex <= -1)
        return Promise.reject({ status: 404, data: { message: 'product not found in cart' } });
      const cartItemsLength = userCart.items.length;
      if (cartItemsLength > 1) {
        await Cart.updateOne({ user_id: userId }, { $pull: { items: { _id: cartItemId } } });
        return Promise.resolve({ status: 204 });
      } else {
        await Cart.findOneAndDelete({ user_id: userId });
        return Promise.resolve({ status: 204 });
      }
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  removeCart: async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user)
        return Promise.reject({ status: 404, data: { message: 'user cart is not found' } });
      await Cart.findOneAndDelete({ user_id: userId });
      return Promise.resolve({ status: 204 });
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  getCartCount: async (userId: string) => {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart)
        return Promise.resolve({
          status: 200,
          data: {
            count: 0,
          },
        });
      return Promise.resolve({
        status: 200,
        data: {
          count: cart.items.length,
        },
      });
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  getCartTotalAmount: async (userId: string) => {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (!cart) return Promise.resolve({ status: 200, data: { total_amount: 0, unit: 'rupees' } });
      const totalAmount = await Cart.aggregate([
        { $match: { user_id: new Types.ObjectId(userId) } },
        {
          $unwind: '$items',
        },
        {
          $project: {
            user_id: '$user_id',
            product_id: '$items.product_id',
            quantity: '$items.quantity',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'items',
          },
        },
        {
          $project: {
            user_id: 1,
            product_id: 1,
            quantity: 1,
            item: {
              $arrayElemAt: ['$items', 0],
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            total_amount: {
              $sum: {
                $multiply: [
                  '$quantity',
                  {
                    $toInt: '$item.price',
                  },
                ],
              },
            },
          },
        },
        {
          $unset: ['_id'],
        },
        {
          $addFields: {
            unit: 'rupees',
          },
        },
      ]);
      return Promise.resolve({ status: 200, data: totalAmount[0] });
    } catch (error) {
      return Promise.reject({ status: 500, data: error });
    }
  },
  changeCartItemQuantity: async (
    userId: ParsedQs[string],
    cartItemId: ParsedQs[string],
    count: number,
  ) => {
    try {
      const userCart = await Cart.findOne({ user_id: userId });
      if (!userCart) return Promise.reject({ status: 404, data: { message: 'cart is empty' } });
      const itemIndex = userCart.items.findIndex((item) => item._id?.toString() === cartItemId);
      if (itemIndex <= -1)
        return Promise.reject({ status: 404, data: { message: 'product not found in cart' } });
      const cartItemsLength = userCart.items.length;
      const cartItemQuantity = userCart.items[itemIndex].quantity;
      if (cartItemsLength < 2 && cartItemQuantity < 2 && count < 0) {
        await Cart.findOneAndDelete({ user_id: userId });
        return Promise.resolve({
          status: 200,
          data: { message: 'last item in cart deleted. cart is now empty' },
        });
      }
      if (cartItemQuantity < 2 && count < 0) {
        await Cart.updateOne({ user_id: userId }, { $pull: { items: { _id: cartItemId } } });
        return Promise.resolve({
          status: 200,
          data: { message: 'cart item quantity decremented' },
        });
      }
      await Cart.updateOne(
        { user_id: userId, 'items._id': cartItemId },
        {
          $inc: { 'items.$.quantity': count },
        },
      );
      return Promise.resolve({ status: 200, data: { message: 'cart item quantity incremented' } });
    } catch (error) {
      return Promise.reject({ status: 500, data: { message: error } });
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
