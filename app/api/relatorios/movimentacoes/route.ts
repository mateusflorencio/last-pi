import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/relatorios/movimentacoes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const tipo = searchParams.get('tipo');
    
    let where = {};
    
    // Filtrar por período
    if (dataInicio && dataFim) {
      where = {
        ...where,
        dataHora: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim)
        }
      };
    }
    
    // Filtrar por tipo
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
    
    // Calcular totais
    const totalEntrada = movimentacoes
      .filter(m => m.tipo === 'ENTRADA')
      .reduce((acc, m) => acc + m.quantidade, 0);
      
    const totalSaida = movimentacoes
      .filter(m => m.tipo === 'SAIDA')
      .reduce((acc, m) => acc + m.quantidade, 0);
    
    return NextResponse.json({
      movimentacoes,
      resumo: {
        totalEntrada,
        totalSaida,
        saldo: totalEntrada - totalSaida,
        quantidadeMovimentacoes: movimentacoes.length
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de movimentações:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de movimentações' },
      { status: 500 }
    );
  }
}
