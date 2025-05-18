import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/relatorios/estoque-baixo
export async function GET() {
  try {
    // Buscar produtos com estoque abaixo do mínimo
    const produtos = await prisma.produto.findMany({
      where: {
        quantidade: {
          lt: prisma.produto.fields.estoqueMinimo
        }
      },
      include: {
        categoria: true
      },
      orderBy: {
        quantidade: 'asc'
      }
    });
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao gerar relatório de estoque baixo:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de estoque baixo' },
      { status: 500 }
    );
  }
}
