const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('registres_lababo', {
    id_reg: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idecat_alum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'alumnes',
        key: 'id_ieducat'
      }
    },
    idecat_prof: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'professors',
        key: 'id_ieduca_prof'
      }
    },
    id_grup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grups',
        key: 'id_grup'
      }
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_sortida: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_entrada: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'registres_lababo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_reg" },
        ]
      },
      {
        name: "idecat_alum",
        using: "BTREE",
        fields: [
          { name: "idecat_alum" },
        ]
      },
      {
        name: "idecat_prof",
        using: "BTREE",
        fields: [
          { name: "idecat_prof" },
        ]
      },
      {
        name: "id_grup",
        using: "BTREE",
        fields: [
          { name: "id_grup" },
        ]
      },
    ]
  });
};
