var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");

module.exports = {
  doSignup: userData => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get()
        .collection(collections.USER_COLLECTION)
        .insertOne(userData)
        .then(data => {
          resolve("user signed up", data);
        });
    });
  },
  doLogin: userData => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
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
};
