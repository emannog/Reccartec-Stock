import { Venda } from '@prisma/client';

export interface IVendaService {
  create(data: {
    cliente?: string;
    itens: {
      produtoId: number;
      quantidade: number;
    }[];
  }): Promise<Venda>;
  findById(id: number): Promise<Venda | null>;
  findAll(): Promise<Venda[]>;
  cancelar(id: number): Promise<Venda>;
}
