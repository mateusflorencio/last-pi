import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categorias
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
    
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

// POST /api/categorias
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { nome, descricao } = body;
    
    if (!nome) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }
    
    const categoria = await prisma.categoria.create({
      data: {
        nome,
        descricao,
      },
    });
    
    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}
