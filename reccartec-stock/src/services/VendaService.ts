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
    desconto?: number;
    tipoDesconto?: string;
  }): Promise<Venda> {
    console.log('VendaService.create chamado', data);
    console.log('Repositories:', {
      vendaRepository: this.vendaRepository,
      produtoRepository: this.produtoRepository,
      movimentacaoRepository: this.movimentacaoRepository
    });

    // Validar itens
    if (!data.itens || data.itens.length === 0) {
      throw new Error('A venda deve ter pelo menos um item');
    }

    // Buscar produtos e calcular total
    const itensComPreco = [];
    let totalOriginal = 0;
    let total = 0;

    for (const item of data.itens) {
      console.log('Buscando produto:', item.produtoId);
      const produto = await this.produtoRepository.findById(item.produtoId);
      if (!produto) {
        throw new Error(`Produto com ID ${item.produtoId} não encontrado`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.quantidade}, Solicitado: ${item.quantidade}`);
      }

      // Calcular preço com desconto do produto (se houver)
      let precoUnitario = produto.preco;
      let descontoAplicadoItem = 0;

      if (produto.desconto && produto.desconto > 0) {
        // Verificar se o desconto ainda é válido
        const descontoValido = !produto.dataFimDesconto || new Date(produto.dataFimDesconto) >= new Date();
        
        if (descontoValido) {
          if (produto.tipoDesconto === 'percentual') {
            descontoAplicadoItem = produto.preco * (produto.desconto / 100);
            precoUnitario = produto.preco - descontoAplicadoItem;
          } else {
            descontoAplicadoItem = produto.desconto;
            precoUnitario = produto.preco - descontoAplicadoItem;
          }
        }
      }

      const subtotalOriginal = produto.preco * item.quantidade;
      const subtotal = precoUnitario * item.quantidade;
      totalOriginal += subtotalOriginal;
      total += subtotal;

      itensComPreco.push({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoOriginal: produto.preco,
        precoUnitario,
        descontoAplicado: descontoAplicadoItem * item.quantidade,
        subtotal
      });
    }

    // Aplicar desconto da venda se houver (sobre o total já com desconto dos produtos)
    let descontoTotal = 0;
    if (data.desconto && data.desconto > 0) {
      if (data.tipoDesconto === 'percentual') {
        descontoTotal = total * (data.desconto / 100);
      } else {
        descontoTotal = data.desconto;
      }
      total = total - descontoTotal;
    }

    console.log('Totais:', { totalOriginal, total, descontoTotal });
    console.log('Itens:', itensComPreco);
    console.log('Criando venda...');
    // Criar venda
    const venda = await this.vendaRepository.create({
      total,
      totalOriginal,
      descontoTotal,
      cliente: data.cliente,
      status: 'CONCLUIDA',
      itens: itensComPreco
    });
    console.log('Venda criada:', venda);

    // Atualizar estoque e registrar movimentações
    for (const item of itensComPreco) {
      console.log('Atualizando estoque do produto:', item.produtoId);
      const novaQuantidade = (await this.produtoRepository.findById(item.produtoId))!.quantidade - item.quantidade;
      await this.produtoRepository.updateQuantidade(item.produtoId, novaQuantidade);

      console.log('Criando movimentação...');
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
    const vendaComItens = venda as any;
    for (const item of vendaComItens.itens) {
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
