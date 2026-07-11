import { NextRequest, NextResponse } from 'next/server';
import { ProdutoService } from '@/services/ProdutoService';

const produtoService = new ProdutoService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { quantidade, motivo } = body;
    
    const produto = await produtoService.registrarEntrada(id, quantidade, motivo);
    return NextResponse.json(produto);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao registrar entrada' },
      { status: 400 }
    );
  }
}
