import { Venda, ItemVenda } from '@prisma/client';

export interface IVendaRepository {
  create(data: {
    total: number;
    totalOriginal?: number;
    descontoTotal?: number | null;
    cliente?: string;
    status?: string;
    itens: {
      produtoId: number;
      quantidade: number;
      precoOriginal?: number;
      precoUnitario: number;
      descontoAplicado?: number | null;
      subtotal: number;
    }[];
  }): Promise<Venda>;
  findById(id: number): Promise<Venda | null>;
  findAll(): Promise<Venda[]>;
  findByPeriodo(inicio: Date, fim: Date): Promise<Venda[]>;
  update(id: number, data: Partial<Venda>): Promise<Venda>;
  delete(id: number): Promise<Venda>;
}
