'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Minus, Trash2, Search, DollarSign, Package, BarChart3, TrendingUp } from 'lucide-react'

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
  desconto: number | null
  tipoDesconto: string | null
  dataFimDesconto: string | null
}

interface CarrinhoItem {
  produto: Produto
  quantidade: number
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([])
  const [cliente, setCliente] = useState('')
  const [showCheckout, setShowCheckout] = useState(true)
  const [desconto, setDesconto] = useState('')
  const [tipoDesconto, setTipoDesconto] = useState<'percentual' | 'valor'>('percentual')
  const [showDescontoField, setShowDescontoField] = useState(false)
  const [stats, setStats] = useState({
    totalProdutos: 0,
    vendasHoje: 0,
    estoqueBaixo: 0
  })

  useEffect(() => {
    fetchProdutos()
    fetchStats()
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/estatisticas')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
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
    const subtotal = carrinho.reduce((total, item) => {
      const preco = getPrecoComDesconto(item.produto)
      return total + (preco * item.quantidade)
    }, 0)
    
    if (!desconto || isNaN(Number(desconto))) return subtotal
    
    const valorDesconto = Number(desconto)
    
    if (tipoDesconto === 'percentual') {
      return subtotal - (subtotal * (valorDesconto / 100))
    } else {
      return subtotal - valorDesconto
    }
  }

  const getSubtotal = () => {
    return carrinho.reduce((total, item) => {
      const preco = getPrecoComDesconto(item.produto)
      return total + (preco * item.quantidade)
    }, 0)
  }

  const getValorDesconto = () => {
    if (!desconto || isNaN(Number(desconto))) return 0
    
    const subtotal = getSubtotal()
    const valorDesconto = Number(desconto)
    
    if (tipoDesconto === 'percentual') {
      return subtotal * (valorDesconto / 100)
    } else {
      return valorDesconto
    }
  }

  const getPrecoComDesconto = (produto: Produto) => {
    if (!produto.desconto || produto.desconto === 0) return produto.preco
    
    // Verificar se o desconto ainda é válido
    if (produto.dataFimDesconto) {
      const dataFim = new Date(produto.dataFimDesconto)
      const agora = new Date()
      if (agora > dataFim) return produto.preco
    }
    
    if (produto.tipoDesconto === 'percentual') {
      return produto.preco - (produto.preco * (produto.desconto / 100))
    } else {
      return produto.preco - produto.desconto
    }
  }

  const temDescontoValido = (produto: Produto) => {
    if (!produto.desconto || produto.desconto === 0) return false
    
    if (produto.dataFimDesconto) {
      const dataFim = new Date(produto.dataFimDesconto)
      const agora = new Date()
      return agora <= dataFim
    }
    
    return true
  }

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio')
      return
    }

    try {
      const vendaData: any = {
        cliente: cliente || null,
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      };

      // Só enviar desconto se houver valor
      if (desconto && Number(desconto) > 0) {
        vendaData.desconto = Number(desconto)
        vendaData.tipoDesconto = tipoDesconto
      }

      console.log('Enviando dados da venda:', vendaData);
      
      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendaData)
      })

      if (response.ok) {
        alert('Venda realizada com sucesso!')
        setCarrinho([])
        setCliente('')
        setDesconto('')
        fetchProdutos()
        fetchStats()
      } else {
        const error = await response.json()
        console.error('Erro do servidor:', error)
        alert(`Erro: ${error.error || 'Erro ao realizar venda'}`)
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-900">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-blue-900" />
              <span className="text-sm text-gray-600">Total de Produtos</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.totalProdutos}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-600">Vendas Hoje</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.vendasHoje}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              <span className="text-sm text-gray-600">Estoque Baixo</span>
            </div>
            <p className="text-3xl font-bold text-orange-500">{stats.estoqueBaixo}</p>
          </div>
        </div>

        {/* Caixa de Vendas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lista de Produtos */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProdutos.map((produto) => {
                const precoComDesconto = getPrecoComDesconto(produto)
                const temDesconto = temDescontoValido(produto)
                
                return (
                  <Card key={produto.id} className="hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-900" onClick={() => adicionarAoCarrinho(produto)}>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-blue-900">{produto.nome}</h3>
                        <p className="text-sm text-gray-500">SKU: {produto.sku}</p>
                        <p className="text-sm text-gray-600">{produto.categoria.nome}</p>
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex flex-col">
                            {temDesconto && (
                              <span className="text-sm text-gray-400 line-through">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                            )}
                            <span className={`text-xl font-bold ${temDesconto ? 'text-orange-600' : 'text-green-600'}`}>
                              R$ {precoComDesconto.toFixed(2)}
                            </span>
                          </div>
                          <span className={`text-sm px-3 py-1 rounded-full ${produto.quantidade <= produto.minimo ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {produto.quantidade}
                          </span>
                        </div>
                        {temDesconto && (
                          <div className="text-sm text-orange-600 font-medium">
                            {produto.tipoDesconto === 'percentual' 
                              ? `${produto.desconto}% OFF` 
                              : `R$ ${(produto.desconto || 0).toFixed(2)} OFF`}
                            {produto.dataFimDesconto && ` • até ${new Date(produto.dataFimDesconto).toLocaleDateString('pt-BR')}`}
                          </div>
                        )}
                        <Button
                          className="w-full mt-2 bg-blue-900 hover:bg-blue-800 py-3"
                          disabled={produto.quantidade === 0}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg">
              <CardHeader className="bg-blue-900 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5" />
                  Carrinho
                  <span className="ml-auto bg-blue-800 px-2 py-1 rounded-full text-sm">
                    {carrinho.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="cliente" className="text-sm">Cliente (opcional)</Label>
                  <Input
                    id="cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nome do cliente"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {carrinho.map((item) => {
                    const precoComDesconto = getPrecoComDesconto(item.produto)
                    const temDesconto = temDescontoValido(item.produto)
                    
                    return (
                      <div key={item.produto.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs truncate">{item.produto.nome}</p>
                          <div className="flex items-center gap-1">
                            {temDesconto && (
                              <span className="text-xs text-gray-400 line-through">
                                R$ {item.produto.preco.toFixed(2)}
                              </span>
                            )}
                            <p className="text-xs text-gray-700 font-medium">
                              R$ {precoComDesconto.toFixed(2)} x {item.quantidade}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-5 text-center text-xs font-medium">{item.quantidade}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-red-600 hover:text-red-700"
                            onClick={() => removerDoCarrinho(item.produto.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {carrinho.length === 0 && (
                    <p className="text-center text-gray-500 text-xs py-4">Carrinho vazio</p>
                  )}
                </div>

                {/* Desconto */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Desconto</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setShowDescontoField(!showDescontoField)}
                    >
                      {showDescontoField ? 'Esconder' : 'Mostrar'}
                    </Button>
                  </div>
                  {showDescontoField && (
                    <div className="flex gap-2">
                      <select
                        value={tipoDesconto}
                        onChange={(e) => setTipoDesconto(e.target.value as 'percentual' | 'valor')}
                        className="flex h-8 w-20 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="percentual">%</option>
                        <option value="valor">R$</option>
                      </select>
                      <Input
                        type="number"
                        value={desconto}
                        onChange={(e) => setDesconto(e.target.value)}
                        placeholder={tipoDesconto === 'percentual' ? '0' : '0.00'}
                        min="0"
                        step={tipoDesconto === 'percentual' ? '1' : '0.01'}
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Totais */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">R$ {getSubtotal().toFixed(2)}</span>
                  </div>
                  {getValorDesconto() > 0 && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-medium text-red-600">-R$ {getValorDesconto().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={finalizarVenda}
                  className="w-full bg-blue-900 hover:bg-blue-800 py-4 text-base"
                  disabled={carrinho.length === 0}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Finalizar Venda
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
