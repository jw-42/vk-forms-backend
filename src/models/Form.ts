import { DataTypes } from "sequelize";
import { Settings } from "./Settings";
import sequelize from "../db";

export const Form = sequelize.define("forms", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  owner_id: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "default" },
  title: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "Новая форма" },
  description: {  type: DataTypes.STRING(255), allowNull: false, defaultValue: "Без описания" },
  cover_id: { type: DataTypes.BIGINT },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  deleter_id: { type: DataTypes.BIGINT },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE }
},{
  updatedAt: false,
  hooks: {
    afterCreate: async (record, options) => {
      await Settings.create({
        form_id: record.id
      });

      record.dataValues = record.id;
    },
    beforeUpdate: (record, options) => {
      // code...
    },
  }
});