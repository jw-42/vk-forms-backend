import { z } from "zod";

export const LoginScheme = z.object({
  params: z.object({
    vk_user_id: z.number().optional(),
    vk_app_id: z.number().optional(),
    vk_chat_id: z.string().optional(),
    vk_is_app_user: z.number().min(0).max(1).optional(),
    vk_are_notifications_enabled: z.number().min(0).max(1).optional(),
    vk_language: z.enum(["ru","uk","ua","en","be","kz","pt","es"]).optional(),
    vk_ref: z.string().optional(),
    vk_access_token_settings: z.string().optional(),
    vk_group_id: z.number().optional(),
    vk_viewer_group_role: z.enum(["admin","editor","member","moder","none"]).optional(),
    vk_platform: z.string().optional(),
    vk_is_favorite: z.number().min(0).max(1).optional(),
    vk_ts: z.number().optional(),
    vk_is_recommended: z.number().min(0).max(1).optional(),
    vk_profile_id: z.number().optional(),
    vk_has_profile_button: z.number().max(1).optional(),
    vk_testing_group_id: z.number().optional(),
    sign: z.string(),
    odr_enabled: z.number().optional()
  })
});