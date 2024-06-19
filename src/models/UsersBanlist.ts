import { DataTypes } from "sequelize";
import sequelize from "../db";

export const UsersBanlist = sequelize.define("users_banlist", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  reason: { type: DataTypes.STRING, allowNull: true },
  banner_id: { type: DataTypes.BIGINT, allowNull: false },
  bannedAt: { type: DataTypes.DATE, allowNull: false },
  finishAt: { type: DataTypes.DATE }
},{
  timestamps: false,
  updatedAt: false
});