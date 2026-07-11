import { Venda, ItemVenda } from '@prisma/client';

export interface IVendaRepository {
  create(data: {
    total: number;
    cliente?: string;
    status?: string;
    itens: {
      produtoId: number;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }[];
  }): Promise<Venda>;
  findById(id: number): Promise<Venda | null>;
  findAll(): Promise<Venda[]>;
  update(id: number, data: Partial<Venda>): Promise<Venda>;
  delete(id: number): Promise<Venda>;
}
