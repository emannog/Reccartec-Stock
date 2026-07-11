import { NextRequest, NextResponse } from 'next/server';
import { VendaService } from '@/services/VendaService';
import { VendaRepository } from '@/repositories/VendaRepository';
import { ProdutoRepository } from '@/repositories/ProdutoRepository';
import { MovimentacaoRepository } from '@/repositories/MovimentacaoRepository';

const vendaService = new VendaService(
  new VendaRepository(),
  new ProdutoRepository(),
  new MovimentacaoRepository()
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venda = await vendaService.findById(Number(params.id));
    if (!venda) {
      return NextResponse.json({ error: 'Venda não encontrada' }, { status: 404 });
    }
    return NextResponse.json(venda);
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    return NextResponse.json({ error: 'Erro ao buscar venda' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venda = await vendaService.cancelar(Number(params.id));
    return NextResponse.json(venda);
  } catch (error: any) {
    console.error('Erro ao cancelar venda:', error);
    return NextResponse.json({ error: error.message || 'Erro ao cancelar venda' }, { status: 400 });
  }
}
