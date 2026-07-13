-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "codigo" INTEGER NOT NULL,
    "preco" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "minimo" INTEGER NOT NULL DEFAULT 0,
    "categoriaId" INTEGER NOT NULL,
    "desconto" REAL DEFAULT 0,
    "tipoDesconto" TEXT DEFAULT 'percentual',
    "dataFimDesconto" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Produto" ("categoriaId", "codigo", "createdAt", "dataFimDesconto", "desconto", "descricao", "id", "minimo", "nome", "preco", "quantidade", "tipoDesconto", "updatedAt") SELECT "categoriaId", "codigo", "createdAt", "dataFimDesconto", "desconto", "descricao", "id", "minimo", "nome", "preco", "quantidade", "tipoDesconto", "updatedAt" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
CREATE UNIQUE INDEX "Produto_codigo_key" ON "Produto"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
