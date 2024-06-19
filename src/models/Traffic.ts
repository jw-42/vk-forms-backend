import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Traffic = sequelize.define("traffic", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  vk_user_id: { type: DataTypes.BIGINT },
  vk_app_id: { type: DataTypes.BIGINT },
  vk_chat_id: { type: DataTypes.BIGINT },
  vk_is_app_user: { type: DataTypes.BOOLEAN },
  vk_are_notifications: { type: DataTypes.BOOLEAN },
  vk_language: { type: DataTypes.STRING },
  vk_ref: { type: DataTypes.STRING },
  vk_access_token_settings: { type: DataTypes.STRING },
  vk_group_id: { type: DataTypes.BIGINT },
  vk_viewer_group_role: { type: DataTypes.STRING },
  vk_platform: { type: DataTypes.STRING },
  vk_is_favorite: { type: DataTypes.BOOLEAN },
  vk_ts: { type: DataTypes.BIGINT },
  vk_is_recommended: { type: DataTypes.BOOLEAN },
  vk_profile_id: { type: DataTypes.BIGINT },
  vk_has_profile_button: { type: DataTypes.BOOLEAN },
  vk_testing_group_id: { type: DataTypes.INTEGER },
  sign: { type: DataTypes.STRING },
  odr_enabled: { type: DataTypes.BOOLEAN }
},{
  timestamps: false,
  updatedAt: false
});