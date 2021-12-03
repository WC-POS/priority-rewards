import { join } from 'path';
import { DataTypes, Sequelize } from 'sequelize';

let sql = null;

const db = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, 'data.db'),
  logging: false
});

const localSync = db.define('LocalSync', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  endDate: { type: DataTypes.DATE, allowNull: true },
  table: { type: DataTypes.STRING }
});

const localSyncItem = db.define('LocalSyncItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fposID: { type: DataTypes.UUID },
  uploadDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  table: { type: DataTypes.STRING },
  additional: { type: DataTypes.STRING, allowNull: true },
  additional2: { type: DataTypes.STRING, allowNull: true }
});

const runMaintenance = async function () {
  await db.sync({ alter: true });
};

export default {
  db,
  models: {
    localSync,
    localSyncItem
  },
  runMaintenance
};
