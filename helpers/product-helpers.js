const db = require("../config/connection");
var collections = require("../config/collections");
const { ObjectId } = require("mongodb");

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection(collections.PRODUCT_COLLECTION)
      .insertOne(product)
      .then(data => {
        console.log("DATA:: ", data);
        callback(data.insertedId.toString());
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray();
      resolve(products);
    });
  },
  deleteProduct: prodId => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .deleteOne({ _id: new ObjectId(prodId) })
        .then(res => {
          resolve(res);
        });
    });
  },
};
