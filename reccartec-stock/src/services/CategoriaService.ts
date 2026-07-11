import { ICategoriaService } from './ICategoriaService';
import { ICategoriaRepository } from '@/repositories/ICategoriaRepository';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';
import { Categoria } from '@prisma/client';

export class CategoriaService implements ICategoriaService {
  private repository: ICategoriaRepository;

  constructor(repository?: ICategoriaRepository) {
    this.repository = repository || new CategoriaRepository();
  }

  async create(data: { nome: string; descricao?: string }): Promise<Categoria> {
    const existing = await this.repository.findByName(data.nome);
    if (existing) {
      throw new Error('Categoria com este nome já existe');
    }
    return this.repository.create(data);
  }

  async findById(id: number): Promise<Categoria | null> {
    return this.repository.findById(id);
  }

  async findByName(nome: string): Promise<Categoria | null> {
    return this.repository.findByName(nome);
  }

  async findAll(): Promise<Categoria[]> {
    return this.repository.findAll();
  }

  async update(id: number, data: { nome?: string; descricao?: string }): Promise<Categoria> {
    const categoria = await this.repository.findById(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    if (data.nome && data.nome !== categoria.nome) {
      const existing = await this.repository.findByName(data.nome);
      if (existing) {
        throw new Error('Categoria com este nome já existe');
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<Categoria> {
    const categoria = await this.repository.findById(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    return this.repository.delete(id);
  }
}
