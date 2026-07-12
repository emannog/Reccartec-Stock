import { IProdutoService } from './IProdutoService';
import { IProdutoRepository } from '@/repositories/IProdutoRepository';
import { IMovimentacaoRepository } from '@/repositories/IMovimentacaoRepository';
import { ProdutoRepository } from '@/repositories/ProdutoRepository';
import { MovimentacaoRepository } from '@/repositories/MovimentacaoRepository';
import { Produto } from '@prisma/client';

export class ProdutoService implements IProdutoService {
  private produtoRepository: IProdutoRepository;
  private movimentacaoRepository: IMovimentacaoRepository;

  constructor(
    produtoRepository?: IProdutoRepository,
    movimentacaoRepository?: IMovimentacaoRepository
  ) {
    this.produtoRepository = produtoRepository || new ProdutoRepository();
    this.movimentacaoRepository = movimentacaoRepository || new MovimentacaoRepository();
  }

  async create(data: {
    nome: string;
    descricao?: string;
    preco: number;
    quantidade: number;
    minimo: number;
    categoriaId: number;
    desconto?: number;
    tipoDesconto?: string;
    dataFimDesconto?: Date;
  }): Promise<Produto> {
    if (data.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (data.quantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    if (data.minimo < 0) {
      throw new Error('Estoque mínimo não pode ser negativo');
    }

    // Gerar próximo código automaticamente
    const produtos = await this.produtoRepository.findAll();
    const maxCodigo = produtos.length > 0 ? Math.max(...produtos.map((p: any) => p.codigo)) : 0;
    const nextCodigo = maxCodigo + 1;

    return this.produtoRepository.create({ ...data, codigo: nextCodigo });
  }

  async findById(id: number): Promise<Produto | null> {
    return this.produtoRepository.findById(id);
  }

  async findByCodigo(codigo: number): Promise<Produto | null> {
    return this.produtoRepository.findByCodigo(codigo);
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.findAll();
  }

  async findByCategoria(categoriaId: number): Promise<Produto[]> {
    return this.produtoRepository.findByCategoria(categoriaId);
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
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (data.preco !== undefined && data.preco < 0) {
      throw new Error('Preço não pode ser negativo');
    }

    if (data.quantidade !== undefined && data.quantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    if (data.minimo !== undefined && data.minimo < 0) {
      throw new Error('Estoque mínimo não pode ser negativo');
    }

    return this.produtoRepository.update(id, data);
  }

  async delete(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    return this.produtoRepository.delete(id);
  }

  async registrarEntrada(produtoId: number, quantidade: number, motivo?: string): Promise<Produto> {
    const produto = await this.produtoRepository.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    await this.movimentacaoRepository.create({
      tipo: 'ENTRADA',
      quantidade,
      produtoId,
      motivo
    });

    const novaQuantidade = produto.quantidade + quantidade;
    return this.produtoRepository.updateQuantidade(produtoId, novaQuantidade);
  }

  async registrarSaida(produtoId: number, quantidade: number, motivo?: string): Promise<Produto> {
    const produto = await this.produtoRepository.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (quantidade > produto.quantidade) {
      throw new Error('Quantidade insuficiente em estoque');
    }

    await this.movimentacaoRepository.create({
      tipo: 'SAIDA',
      quantidade,
      produtoId,
      motivo
    });

    const novaQuantidade = produto.quantidade - quantidade;
    return this.produtoRepository.updateQuantidade(produtoId, novaQuantidade);
  }

  async ajustarEstoque(produtoId: number, quantidade: number, motivo?: string): Promise<Produto> {
    const produto = await this.produtoRepository.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    if (quantidade < 0) {
      throw new Error('Quantidade não pode ser negativa');
    }

    await this.movimentacaoRepository.create({
      tipo: 'AJUSTE',
      quantidade,
      produtoId,
      motivo
    });

    return this.produtoRepository.updateQuantidade(produtoId, quantidade);
  }

  async getProdutosBaixoEstoque(): Promise<Produto[]> {
    const produtos = await this.produtoRepository.findAll();
    return produtos.filter(p => p.quantidade <= p.minimo);
  }
}
