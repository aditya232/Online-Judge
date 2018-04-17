var db = require("./database.js");

var problems_model = db.Model.extend({
  tableName: "problems",
  idAttribute: "id"

});

var problems = db.Collection.extend({
  model: problems_model
});

module.exports = {
  problems_model: db.model("problems_model", problems_model),
  problems: db.collection("problems", problems)
};