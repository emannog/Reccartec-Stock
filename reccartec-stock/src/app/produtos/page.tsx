'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Plus, Search, Edit, Trash2, ArrowDown, ArrowUp, Settings } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  descricao: string | null
  codigo: number
  preco: number
  quantidade: number
  minimo: number
  categoria: {
    id: number
    nome: string
  }
  desconto: number | null
  tipoDesconto: string | null
  dataFimDesconto: string | null
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [showInativos, setShowInativos] = useState(false)
  const [produtosInativosList, setProdutosInativosList] = useState<Produto[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    minimo: '',
    categoriaId: '',
    desconto: '',
    tipoDesconto: 'percentual',
    dataFimDesconto: ''
  })

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
  }, [])

  useEffect(() => {
    if (showInativos) {
      fetchProdutosInativos().then(setProdutosInativosList)
    }
  }, [showInativos])

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      setProdutos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProdutosInativos = async () => {
    try {
      const response = await fetch('/api/produtos/inativos')
      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Erro ao buscar produtos inativos:', error)
      return []
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      setCategorias([])
    }
  }

  const filteredProdutos = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toString().includes(searchTerm.toLowerCase())
  )

  const handleEntrada = async (id: number) => {
    const quantidade = prompt('Quantidade de entrada:')
    if (quantidade && !isNaN(Number(quantidade))) {
      try {
        await fetch(`/api/produtos/${id}/entrada`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade: Number(quantidade), motivo: 'Entrada manual' })
        })
        fetchProdutos()
      } catch (error) {
        console.error('Erro ao registrar entrada:', error)
      }
    }
  }

  const handleSaida = async (id: number) => {
    const quantidade = prompt('Quantidade de saída:')
    if (quantidade && !isNaN(Number(quantidade))) {
      try {
        await fetch(`/api/produtos/${id}/saida`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade: Number(quantidade), motivo: 'Saída manual' })
        })
        fetchProdutos()
      } catch (error) {
        console.error('Erro ao registrar saída:', error)
      }
    }
  }

  const handleDelete = async (id: number) => {
    setConfirmMessage('Tem certeza que deseja desativar este produto?')
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
        
        if (response.ok) {
          setSuccessMessage('Produto desativado com sucesso')
          setShowSuccess(true)
          fetchProdutos()
        } else {
          const error = await response.json()
          setErrorMessage(error.error || 'Erro ao desativar produto')
          setShowError(true)
        }
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
        setErrorMessage('Erro ao desativar produto')
        setShowError(true)
      }
      setShowConfirm(false)
    })
    setShowConfirm(true)
  }

  const handleReativar = async (id: number) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reativar' })
      })
      
      if (response.ok) {
        setSuccessMessage('Produto reativado com sucesso')
        setShowSuccess(true)
        fetchProdutos()
        if (showInativos) {
          const inativos = await fetchProdutosInativos()
          setProdutosInativosList(inativos)
        }
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Erro ao reativar produto')
        setShowError(true)
      }
    } catch (error) {
      console.error('Erro ao reativar produto:', error)
      setErrorMessage('Erro ao reativar produto')
      setShowError(true)
    }
  }

  const handleSave = async () => {
    try {
      const url = isEditing ? `/api/produtos/${selectedProduto?.id}` : '/api/produtos'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao || null,
          preco: Number(formData.preco),
          quantidade: Number(formData.quantidade),
          minimo: Number(formData.minimo),
          categoriaId: Number(formData.categoriaId),
          desconto: formData.desconto ? Number(formData.desconto) : 0,
          tipoDesconto: formData.tipoDesconto,
          dataFimDesconto: formData.dataFimDesconto ? new Date(formData.dataFimDesconto) : null
        })
      })
      
      if (response.ok) {
        setShowModal(false)
        setIsEditing(false)
        setSelectedProduto(null)
        setFormData({
          nome: '',
          descricao: '',
          preco: '',
          quantidade: '',
          minimo: '',
          categoriaId: '',
          desconto: '',
          tipoDesconto: 'percentual',
          dataFimDesconto: ''
        })
        fetchProdutos()
      } else {
        const error = await response.json()
        setErrorMessage(error.error || (isEditing ? 'Erro ao editar produto' : 'Erro ao criar produto'))
        setShowError(true)
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      setErrorMessage(isEditing ? 'Erro ao editar produto' : 'Erro ao criar produto')
      setShowError(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setIsEditing(false)
    setSelectedProduto(null)
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      quantidade: '',
      minimo: '',
      categoriaId: '',
      desconto: '',
      tipoDesconto: 'percentual',
      dataFimDesconto: ''
    })
  }

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto)
    setIsEditing(true)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco.toString(),
      quantidade: produto.quantidade.toString(),
      minimo: produto.minimo.toString(),
      categoriaId: produto.categoria.id.toString(),
      desconto: produto.desconto?.toString() || '',
      tipoDesconto: produto.tipoDesconto || 'percentual',
      dataFimDesconto: produto.dataFimDesconto ? produto.dataFimDesconto.slice(0, 10) : ''
    })
    setShowModal(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pt-8">
      {showError && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-red-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Erro</p>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setShowError(false)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-green-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Sucesso</p>
                  <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                </div>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showConfirm && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-orange-600 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Confirmação</p>
                  <p className="text-sm text-orange-700 mt-1">{confirmMessage}</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowConfirm(false)
                        setConfirmAction(null)
                      }}
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (confirmAction) {
                          confirmAction()
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Produtos</h1>
            <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-blue-900 hover:bg-blue-800">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showInativos ? "default" : "outline"}
                onClick={() => setShowInativos(!showInativos)}
                className={showInativos ? "bg-blue-900 hover:bg-blue-800" : ""}
              >
                {showInativos ? 'Ocultar Inativos' : 'Mostrar Inativos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProdutos.map((produto) => (
            <Card 
              key={produto.id} 
              className={`hover:shadow-lg transition-shadow ${produto.quantidade <= produto.minimo ? 'bg-red-50 border-red-200' : ''}`}
            >
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-lg">{produto.nome}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Cód: {produto.codigo}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(produto)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEntrada(produto.id)}>
                      <ArrowDown className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleSaida(produto.id)}>
                      <ArrowUp className="w-4 h-4 text-red-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(produto.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">{produto.categoria.nome}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">R$ {produto.preco.toFixed(2)}</span>
                  </div>
                  {produto.desconto && produto.desconto > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desconto:</span>
                        <span className="font-medium text-orange-600">
                          {produto.tipoDesconto === 'percentual' 
                            ? `${produto.desconto}%` 
                            : `R$ ${produto.desconto.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Preço c/ desconto:</span>
                        <span className="font-medium text-green-600">
                          R$ {(produto.tipoDesconto === 'percentual'
                            ? produto.preco * (1 - produto.desconto / 100)
                            : produto.preco - produto.desconto).toFixed(2)}
                        </span>
                      </div>
                      {produto.dataFimDesconto && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Desconto até:</span>
                          <span className="font-medium text-orange-600">
                            {new Date(produto.dataFimDesconto).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estoque:</span>
                    <span className={`font-medium ${produto.quantidade <= produto.minimo ? 'text-red-600' : 'text-green-600'}`}>
                      {produto.quantidade} (mín: {produto.minimo})
                    </span>
                  </div>
                  {produto.descricao && (
                    <p className="text-sm text-gray-600 mt-2">{produto.descricao}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProdutos.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        )}

        {showInativos && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Produtos Inativos</h2>
            {produtosInativosList.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-500 text-center">Nenhum produto inativo encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtosInativosList.map((produto) => (
                  <Card key={produto.id} className="hover:shadow-lg transition-shadow border-gray-300 bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-gray-400" />
                            <span className="text-lg text-gray-600">{produto.nome}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Cód: {produto.codigo}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleReativar(produto.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Reativar
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Categoria:</span>
                          <span className="font-medium text-gray-500">{produto.categoria.nome}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Preço:</span>
                          <span className="font-medium text-gray-500">R$ {produto.preco.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quantidade:</span>
                          <span className="font-medium text-gray-500">{produto.quantidade}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{isEditing ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do produto"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do produto"
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade Inicial *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="minimo">Estoque Mínimo *</Label>
                  <Input
                    id="minimo"
                    type="number"
                    value={formData.minimo}
                    onChange={(e) => setFormData({ ...formData, minimo: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <select
                    id="categoria"
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="border-t pt-4">
                  <Label className="text-sm font-semibold text-blue-900 mb-2 block">Configuração de Desconto</Label>
                </div>
                
                <div>
                  <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
                  <select
                    id="tipoDesconto"
                    value={formData.tipoDesconto}
                    onChange={(e) => setFormData({ ...formData, tipoDesconto: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="percentual">Percentual (%)</option>
                    <option value="valor">Valor (R$)</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="desconto">Valor do Desconto</Label>
                  <Input
                    id="desconto"
                    type="number"
                    step={formData.tipoDesconto === 'percentual' ? '1' : '0.01'}
                    min="0"
                    value={formData.desconto}
                    onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                    placeholder={formData.tipoDesconto === 'percentual' ? '0' : '0.00'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dataFimDesconto">Data Fim do Desconto (opcional)</Label>
                  <Input
                    id="dataFimDesconto"
                    type="date"
                    value={formData.dataFimDesconto}
                    onChange={(e) => setFormData({ ...formData, dataFimDesconto: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Se não informado, o desconto será permanente</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Salvar
                  </Button>
                  <Button onClick={handleCloseModal} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
