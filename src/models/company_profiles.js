/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('company_profiles', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    zipcode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contactPerson: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    contactNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    websiteURL: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    industryType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    companyLogo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    companyDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    businessLicense: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    businessLicenseNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    companyAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'company_profiles'
  });
};
