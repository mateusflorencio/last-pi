'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Relatorios() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let url = '/api/relatorios/movimentacoes?';
      
      if (formData.dataInicio && formData.dataFim) {
        url += `dataInicio=${formData.dataInicio}&dataFim=${formData.dataFim}&`;
      }
      
      if (formData.tipo) {
        url += `tipo=${formData.tipo}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }
      
      const data = await response.json();
      setMovimentacoes(data.movimentacoes);
      setResumo(data.resumo);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Voltar
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataInicio">
                  Data Início
                </label>
                <input
                  type="date"
                  id="dataInicio"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataFim">
                  Data Fim
                </label>
                <input
                  type="date"
                  id="dataFim"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo">
                  Tipo de Movimentação
                </label>
                <select
                  id="tipo"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="">Todos</option>
                  <option value="ENTRADA">Entrada</option>
                  <option value="SAIDA">Saída</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  disabled={loading}
                >
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <Link href="/produtos/estoque-baixo" className="block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-center">
                Ver Estoque Baixo
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Relatório de Movimentações</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {resumo && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-semibold text-blue-800">Total de Movimentações</h3>
                      <p className="text-2xl font-bold text-blue-800">{resumo.quantidadeMovimentacoes}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-semibold text-green-800">Total de Entradas</h3>
                      <p className="text-2xl font-bold text-green-800">{resumo.totalEntrada}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="text-sm font-semibold text-orange-800">Total de Saídas</h3>
                      <p className="text-2xl font-bold text-orange-800">{resumo.totalSaida}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-semibold text-purple-800">Saldo</h3>
                      <p className="text-2xl font-bold text-purple-800">{resumo.saldo}</p>
                    </div>
                  </div>
                )}
                
                {movimentacoes && movimentacoes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Data/Hora</th>
                          <th className="py-2 px-4 border-b text-left">Produto</th>
                          <th className="py-2 px-4 border-b text-left">Tipo</th>
                          <th className="py-2 px-4 border-b text-right">Quantidade</th>
                          <th className="py-2 px-4 border-b text-left">Responsável</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimentacoes.map((mov) => (
                          <tr key={mov.id}>
                            <td className="py-2 px-4 border-b">
                              {new Date(mov.dataHora).toLocaleString('pt-BR')}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {mov.produto.codigo} - {mov.produto.nome}
                            </td>
                            <td className="py-2 px-4 border-b">
                              <span className={`px-2 py-1 rounded text-xs ${mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b text-right">{mov.quantidade}</td>
                            <td className="py-2 px-4 border-b">{mov.responsavel || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 py-4">
                    {resumo ? 'Nenhuma movimentação encontrada para os filtros selecionados.' : 'Utilize os filtros para gerar um relatório de movimentações.'}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
