import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/produtos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get('categoriaId');
    const estoqueBaixo = searchParams.get('estoqueBaixo');
    
    let where = {};
    
    if (categoriaId) {
      where = {
        ...where,
        categoriaId: parseInt(categoriaId)
      };
    }
    
    if (estoqueBaixo === 'true') {
      where = {
        ...where,
        quantidade: {
          lt: prisma.produto.fields.estoqueMinimo
        }
      };
    }
    
    const produtos = await prisma.produto.findMany({
      where,
      include: {
        categoria: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST /api/produtos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { nome, descricao, codigo, preco, quantidade, estoqueMinimo, categoriaId } = body;
    
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
    
    // Verificar se código já existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { codigo }
    });
    
    if (produtoExistente) {
      return NextResponse.json(
        { error: 'Código de produto já cadastrado' },
        { status: 400 }
      );
    }
    
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        codigo,
        preco: parseFloat(preco.toString()),
        quantidade: quantidade || 0,
        estoqueMinimo: estoqueMinimo || 5,
        categoriaId
      }
    });
    
    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
