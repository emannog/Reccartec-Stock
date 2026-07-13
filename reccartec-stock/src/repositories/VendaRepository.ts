import { IVendaRepository } from './IVendaRepository';
import { prisma } from '@/lib/prisma';
import { Venda } from '@prisma/client';

export class VendaRepository implements IVendaRepository {
  async create(data: any): Promise<Venda> {
    return await prisma.venda.create({
      data: {
        total: data.total,
        totalOriginal: data.totalOriginal,
        descontoTotal: data.descontoTotal,
        cliente: data.cliente,
        status: data.status || 'CONCLUIDA',
        itens: {
          create: data.itens
        }
      } as any,
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    }) as any;
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

  async findByPeriodo(inicio: Date, fim: Date): Promise<Venda[]> {
    return await prisma.venda.findMany({
      where: {
        createdAt: {
          gte: inicio,
          lt: fim
        },
        status: 'CONCLUIDA'
      },
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
