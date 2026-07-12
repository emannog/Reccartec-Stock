import { prisma } from '@/lib/prisma';
import { IMovimentacaoRepository } from './IMovimentacaoRepository';
import { Movimentacao } from '@prisma/client';

export class MovimentacaoRepository implements IMovimentacaoRepository {
  async create(data: {
    tipo: string;
    quantidade: number;
    produtoId: number;
    motivo?: string;
    vendaId?: number;
  }): Promise<Movimentacao> {
    return prisma.movimentacao.create({ 
      data,
      include: { produto: true }
    });
  }

  async findById(id: number): Promise<Movimentacao | null> {
    return prisma.movimentacao.findUnique({ 
      where: { id },
      include: { produto: true }
    });
  }

  async findByProduto(produtoId: number): Promise<Movimentacao[]> {
    return prisma.movimentacao.findMany({
      where: { produtoId },
      include: { produto: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll(): Promise<Movimentacao[]> {
    return prisma.movimentacao.findMany({
      include: { produto: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
