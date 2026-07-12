'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, X, Calendar, User, Package } from 'lucide-react'

interface Venda {
  id: number
  total: number
  totalOriginal: number | null
  descontoTotal: number | null
  cliente: string | null
  status: string
  createdAt: string
  itens: {
    id: number
    quantidade: number
    precoOriginal: number | null
    precoUnitario: number
    descontoAplicado: number | null
    subtotal: number
    produto: {
      id: number
      nome: string
      codigo: number
    }
  }[]
}

export default function HistoricoVendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVenda, setSelectedVenda] = useState<Venda | null>(null)

  useEffect(() => {
    fetchVendas()
  }, [])

  const fetchVendas = async () => {
    try {
      const response = await fetch('/api/vendas')
      const data = await response.json()
      setVendas(data)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelarVenda = async (id: number) => {
    if (confirm('Tem certeza que deseja cancelar esta venda? O estoque será devolvido.')) {
      try {
        const response = await fetch(`/api/vendas/${id}`, {
          method: 'POST'
        })
        
        if (response.ok) {
          alert('Venda cancelada com sucesso!')
          fetchVendas()
          setSelectedVenda(null)
        } else {
          const error = await response.json()
          alert(error.error || 'Erro ao cancelar venda')
        }
      } catch (error) {
        console.error('Erro ao cancelar venda:', error)
        alert('Erro ao cancelar venda')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800'
      case 'CANCELADA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Histórico de Vendas</h1>
            <p className="text-gray-600 mt-1">Visualize todas as vendas realizadas</p>
          </div>
          <Button onClick={() => window.location.href = '/'} className="w-full md:w-auto bg-blue-900 hover:bg-blue-800">
            Nova Venda
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {vendas.map((venda) => (
            <Card key={venda.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedVenda(venda)}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-lg">Venda #{venda.id}</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venda.status)}`}>
                        {venda.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {venda.totalOriginal && venda.totalOriginal > venda.total && (
                      <div className="text-sm text-gray-400 line-through">
                        R$ {venda.totalOriginal.toFixed(2)}
                      </div>
                    )}
                    <span className="text-lg font-bold text-green-600">
                      R$ {venda.total.toFixed(2)}
                    </span>
                    {venda.descontoTotal && venda.descontoTotal > 0 && (
                      <div className="text-xs text-orange-600">
                        -R$ {venda.descontoTotal.toFixed(2)}
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(venda.createdAt).toLocaleString('pt-BR')}
                  </div>
                  {venda.cliente && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      {venda.cliente}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4" />
                    {venda.itens.length} item(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {vendas.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhuma venda encontrada</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Detalhes da Venda */}
        {selectedVenda && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Venda #{selectedVenda.id}</CardTitle>
                  <Button size="icon" variant="ghost" onClick={() => setSelectedVenda(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVenda.status)}`}>
                      {selectedVenda.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">{new Date(selectedVenda.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                  {selectedVenda.cliente && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Cliente</p>
                      <p className="font-medium">{selectedVenda.cliente}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Itens da Venda</h3>
                  <div className="space-y-2">
                    {selectedVenda.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.produto.nome}</p>
                          <p className="text-sm text-gray-500">Cód: {item.produto.codigo}</p>
                        </div>
                        <div className="text-right">
                          {item.precoOriginal && item.precoOriginal > item.precoUnitario && (
                            <p className="text-xs text-gray-400 line-through">
                              R$ {item.precoOriginal.toFixed(2)}
                            </p>
                          )}
                          <p className="text-sm">R$ {item.precoUnitario.toFixed(2)} x {item.quantidade}</p>
                          {item.descontoAplicado && item.descontoAplicado > 0 && (
                            <p className="text-xs text-orange-600">
                              -R$ {item.descontoAplicado.toFixed(2)}
                            </p>
                          )}
                          <p className="font-medium text-green-600">R$ {item.subtotal.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  {selectedVenda.totalOriginal && selectedVenda.totalOriginal > selectedVenda.total && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Total Original:</span>
                      <span className="text-gray-400 line-through">R$ {selectedVenda.totalOriginal.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedVenda.descontoTotal && selectedVenda.descontoTotal > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Desconto Total:</span>
                      <span className="text-orange-600">-R$ {selectedVenda.descontoTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {selectedVenda.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedVenda.status === 'CONCLUIDA' && (
                  <Button
                    onClick={() => cancelarVenda(selectedVenda.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    Cancelar Venda
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
