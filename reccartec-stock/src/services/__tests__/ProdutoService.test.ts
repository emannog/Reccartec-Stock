import { ProdutoService } from '../ProdutoService';
import { IProdutoRepository } from '@/repositories/IProdutoRepository';
import { IMovimentacaoRepository } from '@/repositories/IMovimentacaoRepository';
import { Produto } from '@prisma/client';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let mockProdutoRepository: jest.Mocked<IProdutoRepository>;
  let mockMovimentacaoRepository: jest.Mocked<IMovimentacaoRepository>;

  beforeEach(() => {
    mockProdutoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCodigo: jest.fn(),
      findAll: jest.fn(),
      findByCategoria: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateQuantidade: jest.fn(),
    };
    mockMovimentacaoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProduto: jest.fn(),
      findAll: jest.fn(),
    };
    service = new ProdutoService(mockProdutoRepository, mockMovimentacaoRepository);
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const data = {
        nome: 'Smartphone',
        descricao: 'Smartphone XYZ',
        preco: 999.99,
        quantidade: 10,
        minimo: 5,
        categoriaId: 1,
      };
      const expected: Produto = {
        id: 1,
        ...data,
        codigo: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: { id: 1, nome: 'Eletrônicos', descricao: null, createdAt: new Date(), updatedAt: new Date(), produtos: [] },
      };
      mockProdutoRepository.findAll.mockResolvedValue([]);
      mockProdutoRepository.create.mockResolvedValue(expected);

      const result = await service.create(data);

      expect(mockProdutoRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('deve lançar erro se preço é negativo', async () => {
      const data = { nome: 'Teste', preco: -100, quantidade: 10, minimo: 5, categoriaId: 1 };
      mockProdutoRepository.findAll.mockResolvedValue([]);

      await expect(service.create(data)).rejects.toThrow('Preço não pode ser negativo');
    });

  });

  describe('registrarEntrada', () => {
    it('deve registrar entrada com sucesso', async () => {
      const produtoId = 1;
      const quantidade = 10;
      const produto: Produto = {
        id: produtoId,
        nome: 'Teste',
        descricao: null,
        codigo: 1,
        preco: 100,
        quantidade: 5,
        minimo: 5,
        categoriaId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: {} as any,
      };
      const updatedProduto: Produto = { ...produto, quantidade: 15 };
      mockProdutoRepository.findById.mockResolvedValue(produto);
      mockMovimentacaoRepository.create.mockResolvedValue({} as any);
      mockProdutoRepository.updateQuantidade.mockResolvedValue(updatedProduto);

      const result = await service.registrarEntrada(produtoId, quantidade, 'Teste');

      expect(mockMovimentacaoRepository.create).toHaveBeenCalledWith({
        tipo: 'ENTRADA',
        quantidade,
        produtoId,
        motivo: 'Teste',
      });
      expect(mockProdutoRepository.updateQuantidade).toHaveBeenCalledWith(produtoId, 15);
    });

    it('deve lançar erro se quantidade é zero ou negativa', async () => {
      await expect(service.registrarEntrada(1, 0)).rejects.toThrow('Quantidade deve ser maior que zero');
      await expect(service.registrarEntrada(1, -5)).rejects.toThrow('Quantidade deve ser maior que zero');
    });
  });

  describe('registrarSaida', () => {
    it('deve registrar saída com sucesso', async () => {
      const produtoId = 1;
      const quantidade = 5;
      const produto: Produto = {
        id: produtoId,
        nome: 'Teste',
        descricao: null,
        codigo: 1,
        preco: 100,
        quantidade: 10,
        minimo: 5,
        categoriaId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: {} as any,
      };
      const updatedProduto: Produto = { ...produto, quantidade: 5 };
      mockProdutoRepository.findById.mockResolvedValue(produto);
      mockMovimentacaoRepository.create.mockResolvedValue({} as any);
      mockProdutoRepository.updateQuantidade.mockResolvedValue(updatedProduto);

      const result = await service.registrarSaida(produtoId, quantidade, 'Teste');

      expect(mockMovimentacaoRepository.create).toHaveBeenCalledWith({
        tipo: 'SAIDA',
        quantidade,
        produtoId,
        motivo: 'Teste',
      });
      expect(mockProdutoRepository.updateQuantidade).toHaveBeenCalledWith(produtoId, 5);
    });

    it('deve lançar erro se quantidade insuficiente', async () => {
      const produto: Produto = {
        id: 1,
        nome: 'Teste',
        descricao: null,
        codigo: 1,
        preco: 100,
        quantidade: 5,
        minimo: 5,
        categoriaId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: {} as any,
      };
      mockProdutoRepository.findById.mockResolvedValue(produto);

      await expect(service.registrarSaida(1, 10)).rejects.toThrow('Quantidade insuficiente em estoque');
    });
  });

  describe('getProdutosBaixoEstoque', () => {
    it('deve retornar produtos com estoque abaixo do mínimo', async () => {
      const produtos: Produto[] = [
        { id: 1, nome: 'Produto 1', descricao: null, codigo: 1, preco: 100, quantidade: 3, minimo: 5, categoriaId: 1, createdAt: new Date(), updatedAt: new Date(), categoria: {} as any },
        { id: 2, nome: 'Produto 2', descricao: null, codigo: 2, preco: 200, quantidade: 10, minimo: 5, categoriaId: 1, createdAt: new Date(), updatedAt: new Date(), categoria: {} as any },
      ];
      mockProdutoRepository.findAll.mockResolvedValue(produtos);

      const result = await service.getProdutosBaixoEstoque();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
});
