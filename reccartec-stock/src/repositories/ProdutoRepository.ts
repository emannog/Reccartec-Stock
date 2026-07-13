import { prisma } from '@/lib/prisma';
import { IProdutoRepository } from './IProdutoRepository';
import { Produto } from '@prisma/client';

export class ProdutoRepository implements IProdutoRepository {
  async create(data: any): Promise<Produto> {
    return prisma.produto.create({ 
      data,
      include: { categoria: true }
    }) as any;
  }

  async findById(id: number): Promise<Produto | null> {
    return prisma.produto.findUnique({ 
      where: { id },
      include: { categoria: true }
    });
  }

  async findByCodigo(codigo: number): Promise<Produto | null> {
    return prisma.produto.findUnique({ 
      where: { codigo: codigo } as any,
      include: { categoria: true }
    }) as any;
  }

  async findAll(): Promise<Produto[]> {
    return prisma.produto.findMany({
      where: { ativo: true },
      include: { categoria: true },
      orderBy: { nome: 'asc' }
    });
  }

  async findAllIncludingInactive(): Promise<Produto[]> {
    return prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { nome: 'asc' }
    });
  }

  async findByCategoria(categoriaId: number): Promise<Produto[]> {
    return prisma.produto.findMany({
      where: { categoriaId, ativo: true },
      include: { categoria: true },
      orderBy: { nome: 'asc' }
    });
  }

  async update(id: number, data: Partial<{
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
    desconto?: number;
    tipoDesconto?: string;
    dataFimDesconto?: Date;
  }>): Promise<Produto> {
    return prisma.produto.update({ 
      where: { id }, 
      data,
      include: { categoria: true }
    });
  }

  async delete(id: number): Promise<Produto> {
    return prisma.produto.update({
      where: { id },
      data: { ativo: false },
      include: { categoria: true }
    });
  }

  async updateQuantidade(id: number, quantidade: number): Promise<Produto> {
    return prisma.produto.update({ 
      where: { id }, 
      data: { quantidade },
      include: { categoria: true }
    });
  }

  async hasDependencias(id: number): Promise<boolean> {
    // Verificar se há produtos ativos nesta categoria
    const produtosAtivos = await prisma.produto.count({
      where: { categoriaId: id, ativo: true }
    });

    return produtosAtivos > 0;
  }

  async reativar(id: number): Promise<Produto> {
    return prisma.produto.update({
      where: { id },
      data: { ativo: true },
      include: { categoria: true }
    });
  }
}
