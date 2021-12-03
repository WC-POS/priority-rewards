const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale', {
    SaleID: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('newsequentialid'),
      primaryKey: true
    },
    StoreID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CheckNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IsSuspend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    WasReopened: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsTrainMode: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsNegativeSale: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsCancelled: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsEncrypted: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    WasRefunded: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CheckWasPrinted: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    DescriptionEdited: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    StartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    EndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TerminalNumber: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    CheckType: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CustomerCount: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    TableIndex: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    StartedEmpID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    TransferEmpID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    SettledEmpID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    CheckDescription: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ItemCount: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    CheckStatus: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    IsRetrieved: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    SubTotal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GratuityPercent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GratuityAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SuspendNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ForgiveTaxMask: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CustomerEntered: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    FTaxToggle: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    TogoFTax: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    OvertAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RecPrtOpts: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CustomerNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DrawerNumber: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    PromisedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DriverID: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    OrderTakerEmpID: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    SurchargeDollars: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OrderPrintTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OvertMedia: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    EmpTips: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    HouseTips: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ExpCourse: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CurrentEmpID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    DueRound: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OrderType: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    StartTerminalNumber: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    CurrentCourse: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    OrigionalSubTotal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SplitNum: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    AssignDriverDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ZoneChargeIndex: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ZoneChargeAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TipCashier: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    PreAuthAmt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    NoSmartVAT: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    GratuityDecimalPlaces: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CustomerPriceLevel: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    SectionPriceLevel: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    SaleSection: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    LightState: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    SalePriceLevel: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    PreCardNum: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: "0"
    },
    PreExpirationDate: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: "0"
    },
    PreTrack2: {
      type: DataTypes.BLOB,
      allowNull: true,
      defaultValue: "0"
    },
    PreCardName: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreAuthResponse: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreMedia: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CreditCardCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GiftSoldCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    GiftUsedCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    PMSCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ReOpenCheckNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    NoSBOutput: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    GratuityEdited: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    TenderCount: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    RevenueCenter: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    CustomerName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CustomerAddress: {
      type: DataTypes.STRING(65),
      allowNull: true
    },
    EmployeeName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DriverName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ExtChkStatus: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    OvertenderOption: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    OvertenderIsTip: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    ShareCount: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    WebLastName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WebFirstName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WebMiddleInitial: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    WebPhone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WebAddress1: {
      type: DataTypes.STRING(65),
      allowNull: true
    },
    WebAddress2: {
      type: DataTypes.STRING(65),
      allowNull: true
    },
    WebCity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WebState: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    WebZip: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    WebEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    WebComment: {
      type: DataTypes.STRING(600),
      allowNull: true
    },
    UpdateDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CustomerDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    TabOutCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TipsBeenChanged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    IsCombined: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    CombinedCheckNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ZoneDriverAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PreIsE2EEncryption: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    PreEncryptedBlock: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEncryptionKey: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreCardSource: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    LanStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    WebOrderCustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IsWebOrderComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    WrkTaxFlags: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    OrigTaxFlags: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    IDProvided: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    PreReferenceNumber: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    LoyaltyLookupResult: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    TicketNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    LevelUpOrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PaydiantTransactionRefID: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    PaydiantCheckoutToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    PSubTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    SuspendNumberTerminal: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
    },
    DataVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ServiceChargeAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ServiceChargePercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ServiceChargeEdited: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    ServiceChargeDecimalPlaces: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    ZoneIsServiceCharge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    PreEncryptedRawSwipe: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PZeroRated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    PreVaultID: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreReferenceData: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreProcessData: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVApplicationLabel: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVAID: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVTVR: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVIAD: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVTSI: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVARC: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVCVM: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreEMVEntryMethod: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    PreZip: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    LevelUpUUID: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ""
    },
    BucketProcessDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PreUsedToSettle: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ReportPreCardNumber: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ReportPreCardName: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ReportPreAuthResponse: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ReportPreTranID: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ReportPreZipCode: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ReportPreCardType: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    MozartOrderNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MozartOrderType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    FanConnectCustomerAccount: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    FanConnectTransactionID: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Sale',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "IX_Sale",
        fields: [
          { name: "StoreID" },
          { name: "IsSuspend" },
        ]
      },
      {
        name: "IX_Sale_CheckNumber",
        fields: [
          { name: "CheckNumber" },
        ]
      },
      {
        name: "IX_Sale_CurrentEmpID",
        fields: [
          { name: "CurrentEmpID" },
        ]
      },
      {
        name: "IX_Sale_DataVersion",
        fields: [
          { name: "DataVersion" },
        ]
      },
      {
        name: "IX_Sale_FinishDate",
        fields: [
          { name: "EndDate" },
        ]
      },
      {
        name: "IX_Sale_IsSuspend",
        fields: [
          { name: "IsSuspend" },
        ]
      },
      {
        name: "IX_Sale_ReOpenCheckNumber",
        fields: [
          { name: "ReOpenCheckNumber" },
        ]
      },
      {
        name: "IX_Sale_StartDate",
        fields: [
          { name: "StartDate" },
        ]
      },
      {
        name: "IX_Sale_SuspendList",
        fields: [
          { name: "StoreID" },
          { name: "IsSuspend" },
          { name: "CurrentEmpID" },
        ]
      },
      {
        name: "IX_Sale_SuspendNumber",
        fields: [
          { name: "SuspendNumber" },
        ]
      },
      {
        name: "IX_Sale_TerminalSuspends",
        fields: [
          { name: "IsSuspend" },
          { name: "TerminalNumber" },
        ]
      },
      {
        name: "PK_EJSaleHeader",
        unique: true,
        fields: [
          { name: "SaleID" },
        ]
      },
    ]
  });
};
