import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categorias/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true }
    });
    
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
      { status: 500 }
    );
  }
}

// PUT /api/categorias/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { nome, descricao } = body;
    
    if (!nome) {
      return NextResponse.json(
        { error: 'Nome da categoria é obrigatório' },
        { status: 400 }
      );
    }
    
    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome,
        descricao,
      },
    });
    
    return NextResponse.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    );
  }
}

// DELETE /api/categorias/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    // Verificar se existem produtos associados
    const produtosCount = await prisma.produto.count({
      where: { categoriaId: id }
    });
    
    if (produtosCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria com produtos associados' },
        { status: 400 }
      );
    }
    
    await prisma.categoria.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    );
  }
}
