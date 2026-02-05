-- DropForeignKey
ALTER TABLE "public"."api_keys" DROP CONSTRAINT "api_keys_client_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_client_id_fkey";

-- CreateIndex
CREATE INDEX "api_keys_client_id_idx" ON "public"."api_keys"("client_id");

-- CreateIndex
CREATE INDEX "products_client_id_idx" ON "public"."products"("client_id");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."api_keys" ADD CONSTRAINT "api_keys_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
