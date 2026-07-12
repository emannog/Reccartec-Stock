-- AlterTable
ALTER TABLE "Produto" ADD COLUMN "dataFimDesconto" DATETIME;
ALTER TABLE "Produto" ADD COLUMN "desconto" REAL DEFAULT 0;
ALTER TABLE "Produto" ADD COLUMN "tipoDesconto" TEXT DEFAULT 'percentual';
