'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, Plus, Search, Edit, Trash2, ArrowDown, ArrowUp } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  descricao: string | null
  sku: string
  preco: number
  quantidade: number
  minimo: number
  categoria: {
    id: number
    nome: string
  }
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [categorias, setCategorias] = useState<any[]>([])
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    preco: '',
    quantidade: '',
    minimo: '',
    categoriaId: ''
  })

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
  }, [])

  const fetchProdutos = async () => {
    try {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const filteredProdutos = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
        fetchProdutos()
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao || null,
          sku: formData.sku,
          preco: Number(formData.preco),
          quantidade: Number(formData.quantidade),
          minimo: Number(formData.minimo),
          categoriaId: Number(formData.categoriaId)
        })
      })
      
      if (response.ok) {
        setShowModal(false)
        setFormData({
          nome: '',
          descricao: '',
          sku: '',
          preco: '',
          quantidade: '',
          minimo: '',
          categoriaId: ''
        })
        fetchProdutos()
      } else {
        alert('Erro ao criar produto')
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      alert('Erro ao criar produto')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      nome: '',
      descricao: '',
      sku: '',
      preco: '',
      quantidade: '',
      minimo: '',
      categoriaId: ''
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <Button onClick={() => setShowModal(true)} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-lg">{produto.nome}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">SKU: {produto.sku}</p>
                  </div>
                  <div className="flex gap-1">
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Novo Produto</CardTitle>
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
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU do produto"
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
