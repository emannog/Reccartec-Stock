import { IVendaRepository } from './IVendaRepository';
import { prisma } from '@/lib/prisma';
import { Venda } from '@prisma/client';

export class VendaRepository implements IVendaRepository {
  async create(data: {
    total: number;
    cliente?: string;
    status?: string;
    itens: {
      produtoId: number;
      quantidade: number;
      precoUnitario: number;
      subtotal: number;
    }[];
  }): Promise<Venda> {
    return await prisma.venda.create({
      data: {
        total: data.total,
        cliente: data.cliente,
        status: data.status || 'CONCLUIDA',
        itens: {
          create: data.itens
        }
      },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  async findById(id: number): Promise<Venda | null> {
    return await prisma.venda.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  async findAll(): Promise<Venda[]> {
    return await prisma.venda.findMany({
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id: number, data: Partial<Venda>): Promise<Venda> {
    return await prisma.venda.update({
      where: { id },
      data,
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
  }

  async delete(id: number): Promise<Venda> {
    return await prisma.venda.delete({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });
  }
}
