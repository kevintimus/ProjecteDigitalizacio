const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grups', {
    id_grup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    curs: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    grup: {
      type: DataTypes.STRING(5),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'grups',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_grup" },
        ]
      },
    ]
  });
};
