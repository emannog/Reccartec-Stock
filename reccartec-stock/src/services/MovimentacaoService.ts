import { IMovimentacaoService } from './IMovimentacaoService';
import { IMovimentacaoRepository } from '@/repositories/IMovimentacaoRepository';
import { MovimentacaoRepository } from '@/repositories/MovimentacaoRepository';
import { Movimentacao } from '@prisma/client';

export class MovimentacaoService implements IMovimentacaoService {
  private repository: IMovimentacaoRepository;

  constructor(repository?: IMovimentacaoRepository) {
    this.repository = repository || new MovimentacaoRepository();
  }

  async create(data: {
    tipo: string;
    quantidade: number;
    produtoId: number;
    motivo?: string;
  }): Promise<Movimentacao> {
    const tiposValidos = ['ENTRADA', 'SAIDA', 'AJUSTE'];
    if (!tiposValidos.includes(data.tipo)) {
      throw new Error('Tipo de movimentação inválido');
    }

    if (data.quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    return this.repository.create(data);
  }

  async findById(id: number): Promise<Movimentacao | null> {
    return this.repository.findById(id);
  }

  async findByProduto(produtoId: number): Promise<Movimentacao[]> {
    return this.repository.findByProduto(produtoId);
  }

  async findAll(): Promise<Movimentacao[]> {
    return this.repository.findAll();
  }
}
