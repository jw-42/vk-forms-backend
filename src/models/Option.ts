import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Option = sequelize.define("options", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  question_id: { type: DataTypes.BIGINT, allowNull: false },
  enable: { type: DataTypes.BOOLEAN, allowNull: false },
  message: { type: DataTypes.STRING(80), allowNull: false },
  order: { type: DataTypes.INTEGER }
},{
  timestamps: false,
  updatedAt: false,
  hooks: {
    afterCreate: (record, options) => {
      record.dataValues = record.id
    }
  }
});