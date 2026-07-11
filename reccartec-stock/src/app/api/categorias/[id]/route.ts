import { NextRequest, NextResponse } from 'next/server';
import { CategoriaService } from '@/services/CategoriaService';

const categoriaService = new CategoriaService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const categoria = await categoriaService.findById(id);
    
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(categoria);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
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
    const categoria = await categoriaService.update(id, body);
    return NextResponse.json(categoria);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar categoria' },
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
    const categoria = await categoriaService.delete(id);
    return NextResponse.json(categoria);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar categoria' },
      { status: 400 }
    );
  }
}
