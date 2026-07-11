import { CategoriaService } from '../CategoriaService';
import { ICategoriaRepository } from '@/repositories/ICategoriaRepository';
import { Categoria } from '@prisma/client';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let mockRepository: jest.Mocked<ICategoriaRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new CategoriaService(mockRepository);
  });

  describe('create', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const data = { nome: 'Eletrônicos', descricao: 'Produtos eletrônicos' };
      const expected: Categoria = { id: 1, ...data, createdAt: new Date(), updatedAt: new Date(), produtos: [] };
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expected);

      const result = await service.create(data);

      expect(mockRepository.findByName).toHaveBeenCalledWith(data.nome);
      expect(mockRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(expected);
    });

    it('deve lançar erro se categoria com mesmo nome já existe', async () => {
      const data = { nome: 'Eletrônicos' };
      const existing: Categoria = { id: 1, nome: 'Eletrônicos', descricao: null, createdAt: new Date(), updatedAt: new Date(), produtos: [] };
      mockRepository.findByName.mockResolvedValue(existing);

      await expect(service.create(data)).rejects.toThrow('Categoria com este nome já existe');
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria com sucesso', async () => {
      const id = 1;
      const data = { nome: 'Eletrônicos Atualizado' };
      const existing: Categoria = { id, nome: 'Eletrônicos', descricao: null, createdAt: new Date(), updatedAt: new Date(), produtos: [] };
      const updated: Categoria = { ...existing, ...data, updatedAt: new Date() };
      mockRepository.findById.mockResolvedValue(existing);
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.update.mockResolvedValue(updated);

      const result = await service.update(id, data);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, data);
      expect(result).toEqual(updated);
    });

    it('deve lançar erro se categoria não encontrada', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(1, { nome: 'Teste' })).rejects.toThrow('Categoria não encontrada');
    });
  });

  describe('delete', () => {
    it('deve deletar uma categoria com sucesso', async () => {
      const id = 1;
      const existing: Categoria = { id, nome: 'Eletrônicos', descricao: null, createdAt: new Date(), updatedAt: new Date(), produtos: [] };
      mockRepository.findById.mockResolvedValue(existing);
      mockRepository.delete.mockResolvedValue(existing);

      const result = await service.delete(id);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(existing);
    });

    it('deve lançar erro se categoria não encontrada', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow('Categoria não encontrada');
    });
  });
});
