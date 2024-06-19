-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
