const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item', {
    ItemID: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('newsequentialid'),
      primaryKey: true
    },
    RegionID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ItemName: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ItemDescription: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Department: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    UPC: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    ReceiptDesc: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PrintDoubleWide: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    PrintAltColor: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ItemCount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: -1
    },
    AlternateItem: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    FireDelay: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    IsModifier: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    OrderPriority: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsStoreChargeable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    AskForPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    TogoSurcharge: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ItemCost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IsScaleable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsNotTippable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    PriceIsNegative: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsPromoItem: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    BergPLU: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ModifierFollowsParent: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ModifierDescription: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    UseModifierMaxSelect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ModifierMaxSelect: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    UseModifierMinSelect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ModifierMinSelect: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    AllowModifierMaxBypass: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    UsePizzaStyle: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    IsTimedItem: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    TimingIncrement: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    MinimumPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    VDUColor: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ShortDescription: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    DefaultCourse: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ChineseOutput: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TripleHigh: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    QuadHigh: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DiscountFlags: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    TaxFlags: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    PrintOptions: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    RemotePrinters: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AllowZeroPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ModifierPriceLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ModifierCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IngredientCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PrepTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MultModPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    MultAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MultRound: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsNotGratable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ModifierSortType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    DisplayIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ModDisplayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    OverridePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    SwappedDept: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    MaxSelectionAllowed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IsShippable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ShipWidth: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ShipHeight: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    ShipLength: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "(N"
    },
    AddPrepTimeToParent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    VDUID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    HHColumnCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    WebDepartmentID: {
      type: DataTypes.UUID,
      allowNull: true
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
    IsModifierGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ModifierPriceRounding: {
      type: DataTypes.TINYINT,
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
    AutoMenuText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AutoMenuStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    AutoMenuEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ItemGrouping: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    IsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    DisplayDescription: {
      type: DataTypes.STRING(140),
      allowNull: true
    },
    ParentItemID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    ItemSizeID: {
      type: DataTypes.UUID,
      allowNull: true
    },
    ImageName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BannerImageName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    BannerFooterImageName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ModifierHeaderDisplayType: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    ModifierFooterDisplayType: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    ShowOnKiosk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    AllowEBT: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ModBannerFooterSelectDesc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    HideSkyTab: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'Item',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "IX_Item",
        unique: true,
        fields: [
          { name: "ItemName" },
          { name: "RegionID" },
        ]
      },
      {
        name: "PK_Item",
        unique: true,
        fields: [
          { name: "ItemID" },
        ]
      },
    ]
  });
};
