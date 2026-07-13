import { Produto } from '@prisma/client';

export interface IProdutoRepository {
  create(data: {
    nome: string;
    descricao?: string;
    codigo: number;
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
  findAllIncludingInactive(): Promise<Produto[]>;
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
  updateQuantidade(id: number, quantidade: number): Promise<Produto>;
  hasDependencias(id: number): Promise<boolean>;
  reativar(id: number): Promise<Produto>;
}
