import { NextResponse } from 'next/server';
import { ProdutoRepository } from '@/repositories/ProdutoRepository';

const produtoRepository = new ProdutoRepository();

export async function GET() {
  try {
    const produtos = await produtoRepository.findAllIncludingInactive();
    const produtosInativos = produtos.filter((p: any) => !p.ativo);
    return NextResponse.json(produtosInativos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos inativos' },
      { status: 500 }
    );
  }
}
