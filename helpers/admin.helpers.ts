const adminHelpers = {
  // getOrders: () => {
  //   return new Promise(async (resolve, reject) => {
  //     db.get()
  //       .collection(collections.ORDER_COLLECTION)
  //       // .find({ status: { $ne: "pending" } })
  //       .find({ $or: [{ status: 'placed' }, { status: 'dispatched' }] })
  //       .sort({ date: -1 })
  //       .toArray()
  //       .then((res) => {
  //         resolve(res);
  //       });
  //   });
  // },
  // updateOrderStatus: ({ orderId, status }) => {
  //   return new Promise((resolve, reject) => {
  //     db.get()
  //       .collection(collections.ORDER_COLLECTION)
  //       .updateOne({ _id: new ObjectId(orderId) }, { $set: { status } })
  //       .then(() => {
  //         resolve({ status: true });
  //       });
  //   });
  // },
  // getOrderProducts: (orderId) => {
  //   return new Promise(async (resolve, reject) => {
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
  // getUsersList: () => {
  //   return new Promise(async (resolve, reject) => {
  //     const usersList = await db.get().collection(collections.USER_COLLECTION).find().toArray();
  //     resolve(usersList);
  //   });
  // },
};

export default adminHelpers;
