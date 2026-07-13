'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, X, Calendar, User, Package, Download } from 'lucide-react'
import jsPDF from 'jspdf'

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
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

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
    setConfirmMessage('Tem certeza que deseja cancelar esta venda? O estoque será devolvido.')
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`/api/vendas/${id}`, {
          method: 'POST'
        })
        
        if (response.ok) {
          setSuccessMessage('Venda cancelada com sucesso!')
          setShowSuccess(true)
          fetchVendas()
          setSelectedVenda(null)
        } else {
          const error = await response.json()
          setErrorMessage(error.error || 'Erro ao cancelar venda')
          setShowError(true)
        }
      } catch (error) {
        console.error('Erro ao cancelar venda:', error)
        setErrorMessage('Erro ao cancelar venda')
        setShowError(true)
      }
      setShowConfirm(false)
    })
    setShowConfirm(true)
  }

  const gerarPDF = (venda: Venda) => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246)
    doc.text('Recibo de Venda', 105, 20, { align: 'center' })
    
    // Informações da venda
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Venda #${venda.id}`, 20, 40)
    doc.text(`Data: ${new Date(venda.createdAt).toLocaleString('pt-BR')}`, 20, 50)
    doc.text(`Status: ${venda.status}`, 20, 60)
    
    if (venda.cliente) {
      doc.text(`Cliente: ${venda.cliente}`, 20, 70)
    }
    
    // Itens
    let y = 85
    doc.setFontSize(14)
    doc.setTextColor(59, 130, 246)
    doc.text('Itens da Venda', 20, y)
    y += 10
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    venda.itens.forEach((item) => {
      doc.text(`${item.produto.nome} (Cód: ${item.produto.codigo})`, 20, y)
      y += 7
      doc.text(`  ${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)} = R$ ${item.subtotal.toFixed(2)}`, 25, y)
      y += 7
      
      if (item.descontoAplicado && item.descontoAplicado > 0) {
        doc.setTextColor(249, 115, 22)
        doc.text(`  Desconto: -R$ ${item.descontoAplicado.toFixed(2)}`, 25, y)
        doc.setTextColor(0, 0, 0)
        y += 7
      }
      
      y += 3
    })
    
    // Totais
    y += 10
    doc.line(20, y, 190, y)
    y += 10
    
    if (venda.totalOriginal && venda.totalOriginal > venda.total) {
      doc.setTextColor(128, 128, 128)
      doc.text(`Total Original: R$ ${venda.totalOriginal.toFixed(2)}`, 20, y)
      y += 7
    }
    
    if (venda.descontoTotal && venda.descontoTotal > 0) {
      doc.setTextColor(249, 115, 22)
      doc.text(`Desconto Total: -R$ ${venda.descontoTotal.toFixed(2)}`, 20, y)
      y += 7
    }
    
    doc.setFontSize(16)
    doc.setTextColor(34, 197, 94)
    doc.text(`Total: R$ ${venda.total.toFixed(2)}`, 20, y + 5)
    
    // Rodapé
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Reccartec Stock - Sistema de Gestão', 105, 280, { align: 'center' })
    
    doc.save(`venda-${venda.id}.pdf`)
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => gerarPDF(selectedVenda)}>
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setSelectedVenda(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
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
