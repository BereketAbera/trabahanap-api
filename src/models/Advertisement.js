/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "advertisement",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      websiteURL: {
        type: DataTypes.STRING
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      adsStart: {
        allowNull: false,
        type: DataTypes.DATE
      },
      adsEnd: {
        allowNull: false,
        type: DataTypes.DATE
      },
      userId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "id"
        }
      },
      orientation: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: "HORIZONTAL"
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      tableName: "advertisement"
    }
  );
};
