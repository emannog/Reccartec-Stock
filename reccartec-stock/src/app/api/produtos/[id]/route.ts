import { NextRequest, NextResponse } from 'next/server';
import { ProdutoService } from '@/services/ProdutoService';

const produtoService = new ProdutoService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const produto = await produtoService.findById(id);
    
    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(produto);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const produto = await produtoService.update(id, body);
    return NextResponse.json(produto);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar produto' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const produto = await produtoService.delete(id);
    return NextResponse.json(produto);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar produto' },
      { status: 400 }
    );
  }
}
