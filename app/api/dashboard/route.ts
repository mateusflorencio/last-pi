import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/dashboard
export async function GET() {
  try {
    // Buscar estatísticas para o dashboard
    const totalProdutos = await prisma.produto.count();
    
    const totalCategorias = await prisma.categoria.count();
    
    const totalEstoque = await prisma.produto.aggregate({
      _sum: {
        quantidade: true
      }
    });
    
    const produtosEstoqueBaixo = await prisma.produto.count({
      where: {
        quantidade: {
          lt: prisma.produto.fields.estoqueMinimo
        }
      }
    });
    
    const movimentacoesRecentes = await prisma.movimentacao.findMany({
      include: {
        produto: true
      },
      orderBy: {
        dataHora: 'desc'
      },
      take: 5
    });
    
    return NextResponse.json({
      totalProdutos,
      totalCategorias,
      totalEstoque: totalEstoque._sum.quantidade || 0,
      produtosEstoqueBaixo,
      movimentacoesRecentes
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    );
  }
}
