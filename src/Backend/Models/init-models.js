var DataTypes = require("sequelize").DataTypes;
var _alumnes = require("./alumnes");
var _grups = require("./grups");
var _professors = require("./professors");
var _registres_lababo = require("./registres_lababo");

function initModels(sequelize) {
  var alumnes = _alumnes(sequelize, DataTypes);
  var grups = _grups(sequelize, DataTypes);
  var professors = _professors(sequelize, DataTypes);
  var registres_lababo = _registres_lababo(sequelize, DataTypes);

  registres_lababo.belongsTo(alumnes, { as: "idecat_alum_alumne", foreignKey: "idecat_alum"});
  alumnes.hasMany(registres_lababo, { as: "registres_lababos", foreignKey: "idecat_alum"});
  alumnes.belongsTo(grups, { as: "codi_grup_mat_grup", foreignKey: "codi_grup_mat"});
  grups.hasMany(alumnes, { as: "alumnes", foreignKey: "codi_grup_mat"});
  registres_lababo.belongsTo(grups, { as: "codi_grup_mat_grup", foreignKey: "codi_grup_mat"});
  grups.hasMany(registres_lababo, { as: "registres_lababos", foreignKey: "codi_grup_mat"});
  registres_lababo.belongsTo(professors, { as: "idecat_prof_professor", foreignKey: "idecat_prof"});
  professors.hasMany(registres_lababo, { as: "registres_lababos", foreignKey: "idecat_prof"});

  return {
    alumnes,
    grups,
    professors,
    registres_lababo,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
