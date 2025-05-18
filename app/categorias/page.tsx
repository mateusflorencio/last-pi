'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categorias');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Nome da categoria é obrigatório');
      return;
    }
    
    try {
      const url = isEditing 
        ? `/api/categorias/${currentId}` 
        : '/api/categorias';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar categoria');
      }
      
      // Limpar formulário e atualizar lista
      setFormData({ nome: '', descricao: '' });
      setIsEditing(false);
      setCurrentId(null);
      fetchCategorias();
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (categoria) => {
    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
    });
    setIsEditing(true);
    setCurrentId(categoria.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir categoria');
      }
      
      fetchCategorias();
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ nome: '', descricao: '' });
    setIsEditing(false);
    setCurrentId(null);
  };

  if (loading && categorias.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        <Link href="/" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Voltar
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
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
            <h2 className="text-xl font-semibold mb-4">Lista de Categorias</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {categorias.length === 0 ? (
              <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Nome</th>
                      <th className="py-2 px-4 border-b text-left">Descrição</th>
                      <th className="py-2 px-4 border-b text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((categoria) => (
                      <tr key={categoria.id}>
                        <td className="py-2 px-4 border-b">{categoria.nome}</td>
                        <td className="py-2 px-4 border-b">{categoria.descricao || '-'}</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleEdit(categoria)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(categoria.id)}
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
