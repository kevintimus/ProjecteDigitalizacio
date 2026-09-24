const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('professors', {
    id_ieduca_prof: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom_prof: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cog1_prof: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cog2_prof: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    correu: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contrasenya: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    admin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'professors',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ieduca_prof" },
        ]
      },
    ]
  });
};
