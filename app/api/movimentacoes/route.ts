import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/movimentacoes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const produtoId = searchParams.get('produtoId');
    const tipo = searchParams.get('tipo');
    
    let where = {};
    
    if (produtoId) {
      where = {
        ...where,
        produtoId: parseInt(produtoId)
      };
    }
    
    if (tipo && (tipo === 'ENTRADA' || tipo === 'SAIDA')) {
      where = {
        ...where,
        tipo
      };
    }
    
    const movimentacoes = await prisma.movimentacao.findMany({
      where,
      include: {
        produto: {
          include: {
            categoria: true
          }
        }
      },
      orderBy: {
        dataHora: 'desc'
      }
    });
    
    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar movimentações' },
      { status: 500 }
    );
  }
}

// POST /api/movimentacoes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { tipo, quantidade, produtoId, responsavel, observacao } = body;
    
    if (!tipo || quantidade === undefined || !produtoId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }
    
    if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
      return NextResponse.json(
        { error: 'Tipo de movimentação inválido' },
        { status: 400 }
      );
    }
    
    if (quantidade <= 0) {
      return NextResponse.json(
        { error: 'Quantidade deve ser maior que zero' },
        { status: 400 }
      );
    }
    
    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
    });
    
    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 400 }
      );
    }
    
    // Verificar estoque disponível para saída
    if (tipo === 'SAIDA' && produto.quantidade < quantidade) {
      return NextResponse.json(
        { error: 'Quantidade insuficiente em estoque' },
        { status: 400 }
      );
    }
    
    // Atualizar estoque do produto
    const novaQuantidade = tipo === 'ENTRADA' 
      ? produto.quantidade + quantidade 
      : produto.quantidade - quantidade;
    
    // Usar transação para garantir consistência
    const [movimentacao, _] = await prisma.$transaction([
      prisma.movimentacao.create({
        data: {
          tipo,
          quantidade,
          produtoId,
          responsavel,
          observacao
        }
      }),
      prisma.produto.update({
        where: { id: produtoId },
        data: { quantidade: novaQuantidade }
      })
    ]);
    
    return NextResponse.json(movimentacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar movimentação' },
      { status: 500 }
    );
  }
}
