'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MovimentacaoEntrada() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    produtoId: '',
    quantidade: '1',
    responsavel: '',
    observacao: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/produtos');
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      const data = await response.json();
      setProdutos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.produtoId || !formData.quantidade) {
      alert('Produto e quantidade são obrigatórios');
      return;
    }
    
    if (parseInt(formData.quantidade) <= 0) {
      alert('A quantidade deve ser maior que zero');
      return;
    }
    
    try {
      const response = await fetch('/api/movimentacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tipo: 'ENTRADA',
          produtoId: parseInt(formData.produtoId),
          quantidade: parseInt(formData.quantidade)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar entrada');
      }
      
      // Limpar formulário e mostrar mensagem de sucesso
      setFormData({
        produtoId: '',
        quantidade: '1',
        responsavel: '',
        observacao: ''
      });
      setSuccess(true);
      
      // Atualizar lista de produtos
      fetchProdutos();
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && produtos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Registrar Entrada de Produtos</h1>
        <div className="flex space-x-2">
          <Link href="/produtos" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Produtos
          </Link>
          <Link href="/movimentacoes/saida" className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
            Saída
          </Link>
          <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Voltar
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Nova Entrada</h2>
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>Entrada registrada com sucesso!</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="produtoId">
                  Produto *
                </label>
                <select
                  id="produtoId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.produtoId}
                  onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.codigo} - {produto.nome} ({produto.quantidade} em estoque)
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantidade">
                  Quantidade *
                </label>
                <input
                  type="number"
                  id="quantidade"
                  min="1"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="responsavel">
                  Responsável
                </label>
                <input
                  type="text"
                  id="responsavel"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observacao">
                  Observação
                </label>
                <textarea
                  id="observacao"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informações</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Utilize este formulário para registrar a entrada de produtos no estoque.
              </p>
              <p className="text-gray-700 mb-2">
                Ao registrar uma entrada, a quantidade do produto será automaticamente atualizada no sistema.
              </p>
              <p className="text-gray-700">
                Todos os campos marcados com * são obrigatórios.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Dicas:</h3>
              <ul className="list-disc pl-5 text-blue-800">
                <li className="mb-1">Verifique o código e nome do produto antes de confirmar</li>
                <li className="mb-1">Informe o responsável pela entrada para melhor controle</li>
                <li className="mb-1">Use o campo de observação para registrar detalhes importantes</li>
                <li>Confira a quantidade atual em estoque antes de registrar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
