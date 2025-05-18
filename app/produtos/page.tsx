'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo: '',
    preco: '',
    quantidade: '0',
    estoqueMinimo: '5',
    categoriaId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
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

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.codigo.trim() || !formData.preco || !formData.categoriaId) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      const url = isEditing 
        ? `/api/produtos/${currentId}` 
        : '/api/produtos';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
          quantidade: parseInt(formData.quantidade),
          estoqueMinimo: parseInt(formData.estoqueMinimo),
          categoriaId: parseInt(formData.categoriaId)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar produto');
      }
      
      // Limpar formulário e atualizar lista
      setFormData({
        nome: '',
        descricao: '',
        codigo: '',
        preco: '',
        quantidade: '0',
        estoqueMinimo: '5',
        categoriaId: ''
      });
      setIsEditing(false);
      setCurrentId(null);
      fetchProdutos();
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (produto) => {
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      codigo: produto.codigo,
      preco: produto.preco.toString(),
      quantidade: produto.quantidade.toString(),
      estoqueMinimo: produto.estoqueMinimo.toString(),
      categoriaId: produto.categoriaId.toString()
    });
    setIsEditing(true);
    setCurrentId(produto.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir produto');
      }
      
      fetchProdutos();
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      descricao: '',
      codigo: '',
      preco: '',
      quantidade: '0',
      estoqueMinimo: '5',
      categoriaId: ''
    });
    setIsEditing(false);
    setCurrentId(null);
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
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <div className="flex space-x-2">
          <Link href="/movimentacoes/entrada" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
            Entrada
          </Link>
          <Link href="/movimentacoes/saida" className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">
            Saída
          </Link>
          <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Voltar
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="codigo">
                  Código *
                </label>
                <input
                  type="text"
                  id="codigo"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoriaId">
                  Categoria *
                </label>
                <select
                  id="categoriaId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preco">
                  Preço *
                </label>
                <input
                  type="number"
                  id="preco"
                  step="0.01"
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantidade">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantidade"
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estoqueMinimo">
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  id="estoqueMinimo"
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.estoqueMinimo}
                  onChange={(e) => setFormData({ ...formData, estoqueMinimo: e.target.value })}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Produtos</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {produtos.length === 0 ? (
              <p className="text-gray-500">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Código</th>
                      <th className="py-2 px-4 border-b text-left">Nome</th>
                      <th className="py-2 px-4 border-b text-left">Categoria</th>
                      <th className="py-2 px-4 border-b text-right">Preço</th>
                      <th className="py-2 px-4 border-b text-right">Qtd</th>
                      <th className="py-2 px-4 border-b text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id} className={produto.quantidade < produto.estoqueMinimo ? 'bg-red-50' : ''}>
                        <td className="py-2 px-4 border-b">{produto.codigo}</td>
                        <td className="py-2 px-4 border-b">{produto.nome}</td>
                        <td className="py-2 px-4 border-b">{produto.categoria?.nome || '-'}</td>
                        <td className="py-2 px-4 border-b text-right">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                        </td>
                        <td className="py-2 px-4 border-b text-right">
                          <span className={produto.quantidade < produto.estoqueMinimo ? 'text-red-600 font-bold' : ''}>
                            {produto.quantidade}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleEdit(produto)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
