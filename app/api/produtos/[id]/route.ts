import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/produtos/[id]
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
    
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { 
        categoria: true,
        movimentacoes: {
          orderBy: {
            dataHora: 'desc'
          },
          take: 10
        }
      }
    });
    
    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

// PUT /api/produtos/[id]
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
    const { nome, descricao, codigo, preco, estoqueMinimo, categoriaId } = body;
    
    if (!nome || !codigo || preco === undefined || !categoriaId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }
    
    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId }
    });
    
    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 400 }
      );
    }
    
    // Verificar se código já existe em outro produto
    const produtoExistente = await prisma.produto.findFirst({
      where: { 
        codigo,
        NOT: {
          id
        }
      }
    });
    
    if (produtoExistente) {
      return NextResponse.json(
        { error: 'Código de produto já cadastrado em outro produto' },
        { status: 400 }
      );
    }
    
    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        codigo,
        preco: parseFloat(preco.toString()),
        estoqueMinimo: estoqueMinimo || 5,
        categoriaId
      }
    });
    
    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE /api/produtos/[id]
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
    
    // Verificar se existem movimentações associadas
    const movimentacoesCount = await prisma.movimentacao.count({
      where: { produtoId: id }
    });
    
    if (movimentacoesCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir produto com movimentações associadas' },
        { status: 400 }
      );
    }
    
    await prisma.produto.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    );
  }
}
