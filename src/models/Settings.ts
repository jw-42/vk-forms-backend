import { BIGINT, DataTypes } from "sequelize";
import sequelize from "../db";

export const Settings = sequelize.define("settings", {
  form_id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, unique: true },
  enable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  anonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  replayed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  updatedAt: { type: DataTypes.DATE }
},{
  timestamps: false
});