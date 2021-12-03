const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('department', {
    DepartmentID: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('newsequentialid'),
      primaryKey: true
    },
    RegionID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    DepartmentName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    DepartmentDescription: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    GroupName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    IsHash: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    PMSBucketNumber: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsUsedOnline: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    WebTitle: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    WebDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    WebThumbPath: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    WebImagePath: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    IsDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    DisplayIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IsParent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ParentDepartmentID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    VDUID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    AskID: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    QuantityMultiplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MobileAskID: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsMobile: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    MobileMessageID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    OverrideAutoMenuButtonSettingsGraphic: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ImageName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AllowEBT: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    HideSkyTab: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'Department',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "IX_Department",
        fields: [
          { name: "RegionID" },
          { name: "DepartmentName" },
        ]
      },
      {
        name: "PK_Department",
        unique: true,
        fields: [
          { name: "DepartmentID" },
        ]
      },
    ]
  });
};
