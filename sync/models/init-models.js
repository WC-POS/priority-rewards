var DataTypes = require("sequelize").DataTypes;
var _department = require("./department");
var _item = require("./item");
var _sale = require("./sale");

function initModels(sequelize) {
  var department = _department(sequelize, DataTypes);
  var item = _item(sequelize, DataTypes);
  var sale = _sale(sequelize, DataTypes);


  return {
    department,
    item,
    sale,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
