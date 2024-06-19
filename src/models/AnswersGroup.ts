import { DataTypes } from "sequelize";
import sequelize from "../db";

export const AnswersGroup = sequelize.define("answers_group", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.BIGINT, allowNull: false },
  form_id: { type: DataTypes.BIGINT, allowNull: false },
  enable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  createdAt: { type: DataTypes.DATE },
  finishAt: { type: DataTypes.DATE }
},{
  hooks: {
    afterCreate: (record, options) => {
      record.dataValues = record.id
    }
  }
});