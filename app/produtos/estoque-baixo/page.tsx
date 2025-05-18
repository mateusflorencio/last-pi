'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EstoqueBaixo() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/relatorios/estoque-baixo');
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos com estoque baixo');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos com Estoque Baixo</h1>
        <div className="flex space-x-2">
          <Link href="/produtos" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Produtos
          </Link>
          <Link href="/movimentacoes/entrada" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            Registrar Entrada
          </Link>
          <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Voltar
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Alerta de Estoque</h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {produtos.length === 0 ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Não há produtos com estoque abaixo do mínimo.</p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-red-600">
              Os seguintes produtos estão com estoque abaixo do mínimo definido e precisam de reposição:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Código</th>
                    <th className="py-2 px-4 border-b text-left">Nome</th>
                    <th className="py-2 px-4 border-b text-left">Categoria</th>
                    <th className="py-2 px-4 border-b text-right">Qtd Atual</th>
                    <th className="py-2 px-4 border-b text-right">Mínimo</th>
                    <th className="py-2 px-4 border-b text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="bg-red-50">
                      <td className="py-2 px-4 border-b">{produto.codigo}</td>
                      <td className="py-2 px-4 border-b">{produto.nome}</td>
                      <td className="py-2 px-4 border-b">{produto.categoria?.nome || '-'}</td>
                      <td className="py-2 px-4 border-b text-right font-bold text-red-600">
                        {produto.quantidade}
                      </td>
                      <td className="py-2 px-4 border-b text-right">
                        {produto.estoqueMinimo}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <Link 
                          href="/movimentacoes/entrada"
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                        >
                          Repor
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
