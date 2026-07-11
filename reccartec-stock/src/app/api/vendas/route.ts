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

export async function GET() {
  try {
    const vendas = await vendaService.findAll();
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const venda = await vendaService.create(body);
    return NextResponse.json(venda, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar venda:', error);
    return NextResponse.json({ error: error.message || 'Erro ao criar venda' }, { status: 400 });
  }
}
