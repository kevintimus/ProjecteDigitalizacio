const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alumnes', {
    id_ieducat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom_alum: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cog1_alum: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cog2_alum: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    foto_alum: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correu_alum: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    susceptible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    id_grup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grups',
        key: 'id_grup'
      }
    }
  }, {
    sequelize,
    tableName: 'alumnes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ieducat" },
        ]
      },
      {
        name: "fk_grup",
        using: "BTREE",
        fields: [
          { name: "id_grup" },
        ]
      },
    ]
  });
};
