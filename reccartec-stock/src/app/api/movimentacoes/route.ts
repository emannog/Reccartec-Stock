import { NextRequest, NextResponse } from 'next/server';
import { MovimentacaoService } from '@/services/MovimentacaoService';

const movimentacaoService = new MovimentacaoService();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const produtoId = searchParams.get('produtoId');
    
    if (produtoId) {
      const movimentacoes = await movimentacaoService.findByProduto(parseInt(produtoId));
      return NextResponse.json(movimentacoes);
    }
    
    const movimentacoes = await movimentacaoService.findAll();
    return NextResponse.json(movimentacoes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar movimentações' },
      { status: 500 }
    );
  }
}
