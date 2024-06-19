import { Answer } from "./Answer";
import { AnswersGroup } from "./AnswersGroup";
import { UsersBanlist } from "./UsersBanlist";
import { Form } from "./Form";
import { Option } from "./Option";
import { Question } from "./Question";
import { Role } from "./Role";
import { Traffic } from "./Traffic";
import { User } from "./User";
import { Settings } from "./Settings";

User.hasMany(Traffic, { foreignKey: "vk_user_id" });
Traffic.belongsTo(User, { foreignKey: "vk_user_id" });

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

User.hasMany(Form, { foreignKey: "owner_id", as: "ownedForms" });
Form.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

User.hasMany(Form, { foreignKey: "deleter_id", as: "deletedForms" });
Form.belongsTo(User, { foreignKey: "deleter_id", as: "deleter" });

Form.hasOne(Settings, { foreignKey: "form_id", as: "settings" });
Settings.belongsTo(Form, { foreignKey: "form_id" });

Form.hasMany(Question, { foreignKey: "form_id" });
Question.belongsTo(Form, { foreignKey: "form_id" });

Question.hasMany(Option, { foreignKey: "question_id" });
Option.belongsTo(Question, { foreignKey: "question_id" });

Form.hasMany(AnswersGroup, { foreignKey: "form_id" });
AnswersGroup.belongsTo(Form, { foreignKey: "form_id" });

User.hasMany(AnswersGroup, { foreignKey: "owner_id" });
AnswersGroup.belongsTo(User, { foreignKey: "owner_id" });

AnswersGroup.hasMany(Answer, { foreignKey: "answers_group_id" });
Answer.belongsTo(AnswersGroup, { foreignKey: "answers_group_id" });

Question.hasMany(Answer, { foreignKey: "question_id" });
Answer.belongsTo(Question, { foreignKey: "question_id" });

Option.hasMany(Answer, { foreignKey: "option_id" });
Answer.belongsTo(Option, { foreignKey: "option_id" });

User.hasMany(UsersBanlist, { foreignKey: "user_id", as: "ban_info" });
UsersBanlist.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UsersBanlist, { foreignKey: "banner_id" });
UsersBanlist.belongsTo(User, { foreignKey: "banner_id" });

export {
  Answer,
  AnswersGroup,
  Traffic,
  Role,
  Option,
  Question,
  Settings,
  Form,
  User,
  UsersBanlist
};
