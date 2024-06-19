import { DataTypes } from "sequelize";
import sequelize from "../db";

export const User = sequelize.define("users", {
  id: { type: DataTypes.BIGINT, primaryKey: true, unique: true },
  createdAt: { type: DataTypes.DATE }
},{
  updatedAt: false
});