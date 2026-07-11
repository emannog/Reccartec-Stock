import { NextRequest, NextResponse } from 'next/server';
import { CategoriaService } from '@/services/CategoriaService';

const categoriaService = new CategoriaService();

export async function GET() {
  try {
    const categorias = await categoriaService.findAll();
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categoria = await categoriaService.create(body);
    return NextResponse.json(categoria, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar categoria' },
      { status: 400 }
    );
  }
}
