import { Produto } from '@prisma/client';

export interface IProdutoRepository {
  create(data: {
    nome: string;
    descricao?: string;
    sku: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
  }): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findBySku(sku: string): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  findByCategoria(categoriaId: number): Promise<Produto[]>;
  update(id: number, data: Partial<{
    nome: string;
    descricao: string;
    sku: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
  }>): Promise<Produto>;
  delete(id: number): Promise<Produto>;
  updateQuantidade(id: number, quantidade: number): Promise<Produto>;
}
