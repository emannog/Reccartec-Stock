import { NextRequest, NextResponse } from 'next/server';
import { VendaService } from '@/services/VendaService';
import { VendaRepository } from '@/repositories/VendaRepository';
import { ProdutoRepository } from '@/repositories/ProdutoRepository';
import { MovimentacaoRepository } from '@/repositories/MovimentacaoRepository';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const vendaRepository = new VendaRepository();
    const produtoRepository = new ProdutoRepository();
    const movimentacaoRepository = new MovimentacaoRepository();
    
    const vendaService = new VendaService(
      vendaRepository,
      produtoRepository,
      movimentacaoRepository
    );
    
    const body = await request.json();
    
    const venda = await vendaService.create(body);
    
    return NextResponse.json(venda, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar venda:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ error: error.message || 'Erro ao criar venda' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inicio = searchParams.get('inicio');
    const fim = searchParams.get('fim');

    const vendaRepository = new VendaRepository();
    const produtoRepository = new ProdutoRepository();
    const movimentacaoRepository = new MovimentacaoRepository();
    
    const vendaService = new VendaService(
      vendaRepository,
      produtoRepository,
      movimentacaoRepository
    );
    
    let vendas;
    if (inicio && fim) {
      const dataInicio = new Date(inicio);
      const dataFim = new Date(fim);
      vendas = await vendaRepository.findByPeriodo(dataInicio, dataFim);
    } else {
      vendas = await vendaService.findAll();
    }
    
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 });
  }
}
