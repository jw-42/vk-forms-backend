-- CreateTable
CREATE TABLE "Role" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "role_id" BIGINT NOT NULL,
    "vk_user_id" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traffic" (
    "id" BIGSERIAL NOT NULL,
    "vk_user_id" BIGINT,
    "vk_app_id" BIGINT,
    "vk_chat_id" BIGINT,
    "vk_is_app_user" INTEGER,
    "vk_are_notifications_enabled" INTEGER,
    "vk_language" TEXT,
    "vk_ref" TEXT,
    "vk_access_token_settings" TEXT,
    "vk_group_id" BIGINT,
    "vk_viewer_group_role" TEXT,
    "vk_platform" TEXT,
    "vk_is_favorite" INTEGER,
    "vk_ts" BIGINT,
    "vk_is_recommended" INTEGER,
    "vk_profile_id" BIGINT,
    "vk_has_profile_button" INTEGER,
    "vk_testing_group_id" BIGINT,
    "sign" TEXT,
    "odr_enabled" INTEGER,

    CONSTRAINT "Traffic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" BIGSERIAL NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" BIGSERIAL NOT NULL,
    "form_id" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "text" VARCHAR(128) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" BIGSERIAL NOT NULL,
    "question_id" BIGINT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "text" VARCHAR(64) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswersGroup" (
    "id" BIGSERIAL NOT NULL,
    "form_id" BIGINT NOT NULL,
    "owner_id" BIGINT NOT NULL,

    CONSTRAINT "AnswersGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answers" (
    "id" BIGSERIAL NOT NULL,
    "answers_group_id" BIGINT NOT NULL,
    "question_id" BIGINT NOT NULL,
    "option_id" BIGINT,
    "value" VARCHAR(255)
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_vk_user_id_key" ON "User"("vk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Traffic_id_key" ON "Traffic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Form_id_key" ON "Form"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_key" ON "Question"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Option_id_key" ON "Option"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AnswersGroup_id_key" ON "AnswersGroup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Answers_id_key" ON "Answers"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traffic" ADD CONSTRAINT "Traffic_vk_user_id_fkey" FOREIGN KEY ("vk_user_id") REFERENCES "User"("vk_user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("vk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersGroup" ADD CONSTRAINT "AnswersGroup_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswersGroup" ADD CONSTRAINT "AnswersGroup_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_answers_group_id_fkey" FOREIGN KEY ("answers_group_id") REFERENCES "AnswersGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
