-- Adicionar campos de desconto à tabela Venda
ALTER TABLE "Venda" ADD COLUMN "totalOriginal" REAL;
ALTER TABLE "Venda" ADD COLUMN "descontoTotal" REAL;

-- Adicionar campos de desconto à tabela ItemVenda
ALTER TABLE "ItemVenda" ADD COLUMN "precoOriginal" REAL;
ALTER TABLE "ItemVenda" ADD COLUMN "descontoAplicado" REAL;
