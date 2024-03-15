const db = require("../config/connection");

module.exports = {
  addProduct: (product, callback) => {
    db.get()
      .collection("product")
      .insertOne(product)
      .then(data => {
        // console.log("DATA:: ", data);
        callback(data.insertedId.toString());
      });
  },
};
