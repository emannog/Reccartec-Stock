import { Produto } from '@prisma/client';

export interface IProdutoService {
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
  registrarEntrada(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  registrarSaida(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  ajustarEstoque(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  getProdutosBaixoEstoque(): Promise<Produto[]>;
}
