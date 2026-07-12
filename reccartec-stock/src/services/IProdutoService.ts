import { Produto } from '@prisma/client';

export interface IProdutoService {
  create(data: {
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
    desconto?: number;
    tipoDesconto?: string;
    dataFimDesconto?: Date;
  }): Promise<Produto>;
  findById(id: number): Promise<Produto | null>;
  findByCodigo(codigo: number): Promise<Produto | null>;
  findAll(): Promise<Produto[]>;
  findByCategoria(categoriaId: number): Promise<Produto[]>;
  update(id: number, data: Partial<{
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
    desconto?: number;
    tipoDesconto?: string;
    dataFimDesconto?: Date;
  }>): Promise<Produto>;
  delete(id: number): Promise<Produto>;
  registrarEntrada(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  registrarSaida(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  ajustarEstoque(produtoId: number, quantidade: number, motivo?: string): Promise<Produto>;
  getProdutosBaixoEstoque(): Promise<Produto[]>;
}
