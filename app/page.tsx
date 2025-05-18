'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do dashboard');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Gerenciamento de Estoque</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Total de Produtos</h2>
          <p className="text-4xl font-bold text-blue-600">{dashboardData?.totalProdutos || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Total de Categorias</h2>
          <p className="text-4xl font-bold text-green-600">{dashboardData?.totalCategorias || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Itens em Estoque</h2>
          <p className="text-4xl font-bold text-purple-600">{dashboardData?.totalEstoque || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Estoque Baixo</h2>
          <p className="text-4xl font-bold text-red-600">{dashboardData?.produtosEstoqueBaixo || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Movimentações Recentes</h2>
          {dashboardData?.movimentacoesRecentes?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Produto</th>
                    <th className="py-2 px-4 border-b text-left">Tipo</th>
                    <th className="py-2 px-4 border-b text-left">Qtd</th>
                    <th className="py-2 px-4 border-b text-left">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.movimentacoesRecentes.map((mov) => (
                    <tr key={mov.id}>
                      <td className="py-2 px-4 border-b">{mov.produto.nome}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{mov.quantidade}</td>
                      <td className="py-2 px-4 border-b">{new Date(mov.dataHora).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma movimentação registrada.</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/produtos" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Gerenciar Produtos</span>
            </Link>
            <Link href="/categorias" className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Gerenciar Categorias</span>
            </Link>
            <Link href="/movimentacoes/entrada" className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Registrar Entrada</span>
            </Link>
            <Link href="/movimentacoes/saida" className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Registrar Saída</span>
            </Link>
            <Link href="/relatorios" className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Relatórios</span>
            </Link>
            <Link href="/produtos/estoque-baixo" className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded flex items-center justify-center">
              <span>Estoque Baixo</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
