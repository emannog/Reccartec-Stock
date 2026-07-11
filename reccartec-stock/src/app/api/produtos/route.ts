import { NextRequest, NextResponse } from 'next/server';
import { ProdutoService } from '@/services/ProdutoService';

const produtoService = new ProdutoService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoriaId = searchParams.get('categoriaId');
    
    if (categoriaId) {
      const produtos = await produtoService.findByCategoria(parseInt(categoriaId));
      return NextResponse.json(produtos);
    }
    
    const produtos = await produtoService.findAll();
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const produto = await produtoService.create(body);
    return NextResponse.json(produto, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar produto' },
      { status: 400 }
    );
  }
}
