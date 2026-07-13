import { IEstatisticaRepository, Estatisticas } from './IEstatisticaRepository';
import { prisma } from '@/lib/prisma';

export class EstatisticaRepository implements IEstatisticaRepository {
  async getEstatisticas(): Promise<Estatisticas> {
    // Total de produtos (apenas ativos)
    const totalProdutos = await prisma.produto.count({
      where: { ativo: true }
    });

    // Vendas hoje (apenas concluídas)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const vendasHoje = await prisma.venda.count({
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        },
        status: 'CONCLUIDA'
      }
    });

    // Estoque baixo (apenas produtos ativos com quantidade <= minimo)
    const produtos = await prisma.produto.findMany({
      where: { ativo: true }
    });
    const estoqueBaixo = produtos.filter((p: any) => p.quantidade <= p.minimo).length;

    return {
      totalProdutos,
      vendasHoje,
      estoqueBaixo
    };
  }
}
