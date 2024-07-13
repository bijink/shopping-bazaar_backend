const db = require('../config/connection');
import collections from '../mongodb/collections';
import { ObjectId } from 'mongodb';

const productHelpers = {
  addProduct: (product, callback) => {
    db.get()
      .collection(collections.PRODUCT_COLLECTION)
      .insertOne(product)
      .then((data) => {
        console.log('ADDED_PRODUCT_DATA:: ', data);
        callback(data.insertedId.toString());
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      const products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray();
      resolve(products);
    });
  },
  deleteProduct: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .deleteOne({ _id: new ObjectId(prodId) })
        .then((res) => {
          resolve(res);
        });
    });
  },
  getProductDetails: (prodId) => {
    return new Promise(async (resolve, reject) => {
      const product = await db
        .get()
        .collection(collections.PRODUCT_COLLECTION)
        .findOne({ _id: new ObjectId(prodId) });
      resolve(product);
    });
  },
  updateProduct: (prodId, prodDetails) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_COLLECTION)
        .updateOne(
          { _id: new ObjectId(prodId) },
          {
            $set: {
              name: prodDetails.name,
              category: prodDetails.category,
              description: prodDetails.description,
              price: prodDetails.price,
            },
          },
        )
        .then((response) => {
          resolve();
        });
    });
  },
};

export default productHelpers;
