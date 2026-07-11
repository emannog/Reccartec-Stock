import { IVendaService } from './IVendaService';
import { IVendaRepository } from '@/repositories/IVendaRepository';
import { IProdutoRepository } from '@/repositories/IProdutoRepository';
import { IMovimentacaoRepository } from '@/repositories/IMovimentacaoRepository';
import { Venda } from '@prisma/client';

export class VendaService implements IVendaService {
  constructor(
    private vendaRepository: IVendaRepository,
    private produtoRepository: IProdutoRepository,
    private movimentacaoRepository: IMovimentacaoRepository
  ) {}

  async create(data: {
    cliente?: string;
    itens: {
      produtoId: number;
      quantidade: number;
    }[];
  }): Promise<Venda> {
    // Validar itens
    if (!data.itens || data.itens.length === 0) {
      throw new Error('A venda deve ter pelo menos um item');
    }

    // Buscar produtos e calcular total
    const itensComPreco = [];
    let total = 0;

    for (const item of data.itens) {
      const produto = await this.produtoRepository.findById(item.produtoId);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.quantidade}, Solicitado: ${item.quantidade}`);
      }

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      itensComPreco.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal
      });
    }

    // Criar venda
    const venda = await this.vendaRepository.create({
      total,
      cliente: data.cliente,
      status: 'CONCLUIDA',
      itens: itensComPreco
    });

    // Atualizar estoque e registrar movimentações
    for (const item of itensComPreco) {
      const novaQuantidade = (await this.produtoRepository.findById(item.produtoId))!.quantidade - item.quantidade;
      await this.produtoRepository.updateQuantidade(item.produtoId, novaQuantidade);

      await this.movimentacaoRepository.create({
        tipo: 'SAIDA',
        quantidade: item.quantidade,
        produtoId: item.produtoId,
        motivo: `Venda #${venda.id}`,
        vendaId: venda.id
      });
    }

    return venda;
  }

  async findById(id: number): Promise<Venda | null> {
    return await this.vendaRepository.findById(id);
  }

  async findAll(): Promise<Venda[]> {
    return await this.vendaRepository.findAll();
  }

  async cancelar(id: number): Promise<Venda> {
    const venda = await this.vendaRepository.findById(id);
    if (!venda) {
      throw new Error('Venda não encontrada');
    }

    if (venda.status === 'CANCELADA') {
      throw new Error('Venda já está cancelada');
    }

    // Devolver estoque
    for (const item of venda.itens as any) {
      const produto = await this.produtoRepository.findById(item.produtoId);
      if (produto) {
        const novaQuantidade = produto.quantidade + item.quantidade;
        await this.produtoRepository.updateQuantidade(item.produtoId, novaQuantidade);

        await this.movimentacaoRepository.create({
          tipo: 'ENTRADA',
          quantidade: item.quantidade,
          produtoId: item.produtoId,
          motivo: `Cancelamento da venda #${venda.id}`
        });
      }
    }

    return await this.vendaRepository.update(id, { status: 'CANCELADA' });
  }
}
