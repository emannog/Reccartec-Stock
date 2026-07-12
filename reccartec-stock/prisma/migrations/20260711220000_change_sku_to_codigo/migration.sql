-- Remover índice único do SKU
DROP INDEX IF EXISTS "Produto_sku_key";

-- Adicionar coluna codigo
ALTER TABLE "Produto" ADD COLUMN "codigo" INTEGER NOT NULL DEFAULT 0;

-- Popular codigo com valores sequenciais baseados no ID
UPDATE "Produto" SET "codigo" = id;

-- Tornar codigo unico
CREATE UNIQUE INDEX "Produto_codigo_key" ON "Produto"("codigo");

-- Remover coluna sku
ALTER TABLE "Produto" DROP COLUMN "sku";
