var db = require("./database.js");

var user_model = db.Model.extend({
  tableName: "user",
  idAttribute: "id"

});

var user = db.Collection.extend({
  model: user_model
});

module.exports = {
  user_model: db.model("user_model", user_model),
  user: db.collection("user", user)
};

