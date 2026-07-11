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
    
    const produto = await produtoService.registrarSaida(id, quantidade, motivo);
    return NextResponse.json(produto);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao registrar saída' },
      { status: 400 }
    );
  }
}
