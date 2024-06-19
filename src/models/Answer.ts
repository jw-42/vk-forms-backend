import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Answer = sequelize.define("answers", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  answers_group_id: { type: DataTypes.BIGINT, allowNull: false },
  question_id: { type: DataTypes.BIGINT, allowNull: false },
  option_id: { type: DataTypes.BIGINT },
  value: { type: DataTypes.STRING(80) }
},{
  timestamps: false,
  updatedAt: false
});