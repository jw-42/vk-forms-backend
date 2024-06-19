import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Question = sequelize.define("questions", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  form_id: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.STRING(32), allowNull: false },
  enable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  message: { type: DataTypes.STRING(80), }
});