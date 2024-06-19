import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Role = sequelize.define("roles", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(32), allowNull: false, unique: true }
},{
  updatedAt: false
});