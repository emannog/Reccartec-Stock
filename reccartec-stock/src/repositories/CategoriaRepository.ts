import { prisma } from '@/lib/prisma';
import { ICategoriaRepository } from './ICategoriaRepository';
import { Categoria } from '@prisma/client';

export class CategoriaRepository implements ICategoriaRepository {
  async create(data: { nome: string; descricao?: string }): Promise<Categoria> {
    return prisma.categoria.create({ data });
  }

  async findById(id: number): Promise<Categoria | null> {
    return prisma.categoria.findUnique({ where: { id } });
  }

  async findByName(nome: string): Promise<Categoria | null> {
    return prisma.categoria.findUnique({ where: { nome } });
  }

  async findAll(): Promise<Categoria[]> {
    return prisma.categoria.findMany({
      include: { produtos: true },
      orderBy: { nome: 'asc' }
    });
  }

  async update(id: number, data: { nome?: string; descricao?: string }): Promise<Categoria> {
    return prisma.categoria.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Categoria> {
    return prisma.categoria.delete({ where: { id } });
  }

  async hasDependencias(id: number): Promise<boolean> {
    const produtosAtivos = await prisma.produto.count({
      where: { categoriaId: id, ativo: true }
    });

    return produtosAtivos > 0;
  }
}
