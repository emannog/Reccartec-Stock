import { NextResponse } from 'next/server';
import { ProdutoService } from '@/services/ProdutoService';

const produtoService = new ProdutoService();

export async function GET() {
  try {
    const produtos = await produtoService.getProdutosBaixoEstoque();
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos com baixo estoque' },
      { status: 500 }
    );
  }
}
