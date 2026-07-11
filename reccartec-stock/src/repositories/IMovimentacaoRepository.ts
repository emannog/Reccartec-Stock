import { Movimentacao } from '@prisma/client';

export interface IMovimentacaoRepository {
  create(data: {
    tipo: string;
    quantidade: number;
    produtoId: number;
    motivo?: string;
  }): Promise<Movimentacao>;
  findById(id: number): Promise<Movimentacao | null>;
  findByProduto(produtoId: number): Promise<Movimentacao[]>;
  findAll(): Promise<Movimentacao[]>;
}
