import { Categoria } from '@prisma/client';

export interface ICategoriaService {
  create(data: { nome: string; descricao?: string }): Promise<Categoria>;
  findById(id: number): Promise<Categoria | null>;
  findByName(nome: string): Promise<Categoria | null>;
  findAll(): Promise<Categoria[]>;
  update(id: number, data: { nome?: string; descricao?: string }): Promise<Categoria>;
  delete(id: number): Promise<Categoria>;
}
