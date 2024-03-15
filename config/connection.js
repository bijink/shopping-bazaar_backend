var { MongoClient } = require("mongodb");

const state = {
  db: null,
};

module.exports.connect = async function (done) {
  // const url = "mongodb://127.0.0.1:27017";
  const url = "mongodb://localhost:27017";
  const dbname = "shopping";

  // MongoClient.connect(url, (err, data) => {
  //   if (err) return done(err);
  //   // else console.log("DATA:: ", data);
  //   state.db = data.db(dbname);
  //   done();
  // });
  const client = new MongoClient(url);

  await client
    .connect()
    .then(data => {
      state.db = data.db(dbname);
      done();
    })
    .catch(err => {
      return done(err);
    });
};

module.exports.get = function () {
  return state.db;
};
