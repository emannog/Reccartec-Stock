import { NextRequest, NextResponse } from 'next/server';
import { VendaRepository } from '@/repositories/VendaRepository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inicio = searchParams.get('inicio');
    const fim = searchParams.get('fim');

    if (!inicio || !fim) {
      return NextResponse.json({ error: 'Parâmetros inicio e fim são obrigatórios' }, { status: 400 });
    }

    const vendaRepository = new VendaRepository();
    
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    const vendas = await vendaRepository.findByPeriodo(dataInicio, dataFim);

    const total = vendas.reduce((sum: number, venda: any) => sum + venda.total, 0);
    const totalOriginal = vendas.reduce((sum: number, venda: any) => sum + (venda.totalOriginal || venda.total), 0);
    const descontoTotal = vendas.reduce((sum: number, venda: any) => sum + (venda.descontoTotal || 0), 0);
    const quantidadeVendas = vendas.length;
    const ticketMedio = quantidadeVendas > 0 ? total / quantidadeVendas : 0;

    return NextResponse.json({
      total,
      totalOriginal,
      descontoTotal,
      quantidadeVendas,
      ticketMedio
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento:', error);
    return NextResponse.json({ error: 'Erro ao buscar faturamento' }, { status: 500 });
  }
}
