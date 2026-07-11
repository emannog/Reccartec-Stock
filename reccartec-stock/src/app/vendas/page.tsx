'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingCart, Plus, Minus, Trash2, Search, DollarSign } from 'lucide-react'

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

interface CarrinhoItem {
  produto: Produto
  quantidade: number
}

export default function VendasPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([])
  const [cliente, setCliente] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    fetchProdutos()
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

  const filteredProdutos = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const adicionarAoCarrinho = (produto: Produto) => {
    if (produto.quantidade === 0) {
      alert('Produto sem estoque')
      return
    }

    const itemExistente = carrinho.find(item => item.produto.id === produto.id)
    const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0

    if (quantidadeNoCarrinho >= produto.quantidade) {
      alert('Estoque máximo atingido para este produto')
      return
    }

    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ))
    } else {
      setCarrinho([...carrinho, { produto, quantidade: 1 }])
    }
  }

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId))
  }

  const alterarQuantidade = (produtoId: number, delta: number) => {
    const item = carrinho.find(i => i.produto.id === produtoId)
    if (!item) return

    const novaQuantidade = item.quantidade + delta

    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId)
      return
    }

    if (novaQuantidade > item.produto.quantidade) {
      alert('Estoque máximo atingido')
      return
    }

    setCarrinho(carrinho.map(i =>
      i.produto.id === produtoId
        ? { ...i, quantidade: novaQuantidade }
        : i
    ))
  }

  const getTotal = () => {
    return carrinho.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0)
  }

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio')
      return
    }

    try {
      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: cliente || null,
          itens: carrinho.map(item => ({
            produtoId: item.produto.id,
            quantidade: item.quantidade
          }))
        })
      })

      if (response.ok) {
        alert('Venda realizada com sucesso!')
        setCarrinho([])
        setCliente('')
        setShowCheckout(false)
        fetchProdutos()
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao realizar venda')
      }
    } catch (error) {
      console.error('Erro ao realizar venda:', error)
      alert('Erro ao realizar venda')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Nova Venda</h1>
          <Button onClick={() => setShowCheckout(!showCheckout)} className="w-full md:w-auto" disabled={carrinho.length === 0}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Carrinho ({carrinho.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProdutos.map((produto) => (
                <Card key={produto.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{produto.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                      <p className="text-sm text-gray-600">{produto.categoria.nome}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                        <span className={`text-sm ${produto.quantidade <= produto.minimo ? 'text-red-600' : 'text-green-600'}`}>
                          Estoque: {produto.quantidade}
                        </span>
                      </div>
                      <Button
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="w-full mt-2"
                        disabled={produto.quantidade === 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProdutos.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <p>Nenhum produto encontrado</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Carrinho */}
          {showCheckout && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Carrinho
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cliente">Cliente (opcional)</Label>
                    <Input
                      id="cliente"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {carrinho.map((item) => (
                      <div key={item.produto.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.produto.nome}</p>
                          <p className="text-xs text-gray-500">R$ {item.produto.preco.toFixed(2)} x {item.quantidade}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantidade}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removerDoCarrinho(item.produto.id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {carrinho.length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-4">Carrinho vazio</p>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">R$ {getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={finalizarVenda}
                    className="w-full"
                    disabled={carrinho.length === 0}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Finalizar Venda
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
