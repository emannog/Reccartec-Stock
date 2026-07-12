import { NextRequest, NextResponse } from 'next/server';
import { VendaService } from '@/services/VendaService';
import { VendaRepository } from '@/repositories/VendaRepository';
import { ProdutoRepository } from '@/repositories/ProdutoRepository';
import { MovimentacaoRepository } from '@/repositories/MovimentacaoRepository';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando criação de venda...');
    const vendaRepository = new VendaRepository();
    const produtoRepository = new ProdutoRepository();
    const movimentacaoRepository = new MovimentacaoRepository();
    
    console.log('Repositories criados:', { vendaRepository, produtoRepository, movimentacaoRepository });
    
    const vendaService = new VendaService(
      vendaRepository,
      produtoRepository,
      movimentacaoRepository
    );
    
    console.log('VendaService criado');
    
    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const venda = await vendaService.create(body);
    console.log('Venda criada:', venda);
    
    return NextResponse.json(venda, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar venda:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ error: error.message || 'Erro ao criar venda' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const vendaRepository = new VendaRepository();
    const produtoRepository = new ProdutoRepository();
    const movimentacaoRepository = new MovimentacaoRepository();
    
    const vendaService = new VendaService(
      vendaRepository,
      produtoRepository,
      movimentacaoRepository
    );
    
    const vendas = await vendaService.findAll();
    return NextResponse.json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 });
  }
}
