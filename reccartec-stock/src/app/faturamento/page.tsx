'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, Calendar, TrendingUp, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Receipt, X } from 'lucide-react'

type Periodo = 'diario' | 'semanal' | 'mensal' | 'anual' | 'custom'

interface FaturamentoData {
  total: number
  totalOriginal: number
  descontoTotal: number
  quantidadeVendas: number
  ticketMedio: number
}

export default function FaturamentoPage() {
  const [periodo, setPeriodo] = useState<Periodo>('diario')
  const [faturamento, setFaturamento] = useState<FaturamentoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [datas, setDatas] = useState({ inicio: '', fim: '' })
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false)
  const [vendasRelatorio, setVendasRelatorio] = useState<any[]>([])
  const [loadingRelatorio, setLoadingRelatorio] = useState(false)
  const [dataInicioCustom, setDataInicioCustom] = useState('')
  const [dataFimCustom, setDataFimCustom] = useState('')

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const anos = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

  const getDatas = (periodo: Periodo, dataBase: Date = new Date()) => {
    let inicio: Date
    let fim: Date

    switch (periodo) {
      case 'diario':
        inicio = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate())
        fim = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() + 1)
        break
      case 'semanal':
        const diaSemana = dataBase.getDay()
        const diff = diaSemana === 0 ? 6 : diaSemana - 1 // Ajustar para segunda-feira
        inicio = new Date(dataBase.getFullYear(), dataBase.getMonth(), dataBase.getDate() - diff)
        fim = new Date(inicio)
        fim.setDate(fim.getDate() + 7)
        break
      case 'mensal':
        inicio = new Date(anoSelecionado, mesSelecionado, 1)
        fim = new Date(anoSelecionado, mesSelecionado + 1, 1)
        break
      case 'anual':
        inicio = new Date(anoSelecionado, 0, 1)
        fim = new Date(anoSelecionado + 1, 0, 1)
        break
      case 'custom':
        if (dataInicioCustom && dataFimCustom) {
          inicio = new Date(dataInicioCustom + 'T00:00:00')
          fim = new Date(dataFimCustom + 'T23:59:59')
        } else {
          inicio = new Date()
          fim = new Date()
        }
        break
    }

    return {
      inicio: inicio.toISOString().split('T')[0],
      fim: fim.toISOString().split('T')[0],
      inicioFormatado: inicio.toLocaleDateString('pt-BR'),
      fimFormatado: fim.toLocaleDateString('pt-BR')
    }
  }

  const formatarPeriodo = (periodo: Periodo, dataBase: Date = new Date()) => {
    const d = getDatas(periodo, dataBase)
    switch (periodo) {
      case 'diario':
        return 'Hoje'
      case 'semanal':
        return `${d.inicioFormatado} a ${d.fimFormatado}`
      case 'mensal':
        return `${meses[mesSelecionado]}`
      case 'anual':
        return `${anoSelecionado}`
      case 'custom':
        if (dataInicioCustom && dataFimCustom) {
          return `${new Date(dataInicioCustom).toLocaleDateString('pt-BR')} a ${new Date(dataFimCustom).toLocaleDateString('pt-BR')}`
        }
        return 'Periodo'
    }
  }


  const navegarPeriodo = (direcao: 'anterior' | 'proximo') => {
    switch (periodo) {
      case 'semanal':
        const novaData = new Date(dataSelecionada)
        novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 7 : -7))
        setDataSelecionada(novaData)
        break
      case 'mensal':
        const novoMes = mesSelecionado + (direcao === 'proximo' ? 1 : -1)
        if (novoMes >= 0 && novoMes < 12) {
          setMesSelecionado(novoMes)
        } else if (novoMes >= 12) {
          setMesSelecionado(0)
          setAnoSelecionado(anoSelecionado + 1)
        } else {
          setMesSelecionado(11)
          setAnoSelecionado(anoSelecionado - 1)
        }
        break
      case 'anual':
        const novoAno = anoSelecionado + (direcao === 'proximo' ? 1 : -1)
        if (anos.includes(novoAno)) {
          setAnoSelecionado(novoAno)
        }
        break
    }
  }

  const gerarRelatorio = async () => {
    setLoadingRelatorio(true)
    setMostrarRelatorio(true)
    try {
      const d = getDatas(periodo, dataSelecionada)
      const response = await fetch(`/api/vendas?inicio=${d.inicio}&fim=${d.fim}`)
      const data = await response.json()
      setVendasRelatorio(data)
    } catch (error) {
      console.error('Erro ao buscar vendas para relatório:', error)
    } finally {
      setLoadingRelatorio(false)
    }
  }

  const fetchFaturamento = async () => {
    setLoading(true)
    try {
      const d = getDatas(periodo, dataSelecionada)
      setDatas({ inicio: d.inicio, fim: d.fim })
      
      const response = await fetch(`/api/faturamento?inicio=${d.inicio}&fim=${d.fim}`)
      const data = await response.json()
      setFaturamento(data)
    } catch (error) {
      console.error('Erro ao buscar faturamento:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (periodo !== 'custom') {
      fetchFaturamento()
    }
  }, [periodo, dataSelecionada, mesSelecionado, anoSelecionado])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Faturamento</h1>
            <p className="text-gray-600 mt-1">Visualize o faturamento por período</p>
          </div>
        </div>

        {/* Filtros de Período */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={periodo === 'diario' ? 'default' : 'outline'}
                onClick={() => setPeriodo('diario')}
                className={periodo === 'diario' ? 'bg-blue-900 hover:bg-blue-800' : ''}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Diário
              </Button>
              <Button
                variant={periodo === 'semanal' ? 'default' : 'outline'}
                onClick={() => setPeriodo('semanal')}
                className={periodo === 'semanal' ? 'bg-blue-900 hover:bg-blue-800' : ''}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Semanal
              </Button>
              <Button
                variant={periodo === 'mensal' ? 'default' : 'outline'}
                onClick={() => setPeriodo('mensal')}
                className={periodo === 'mensal' ? 'bg-blue-900 hover:bg-blue-800' : ''}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Mensal
              </Button>
              <Button
                variant={periodo === 'anual' ? 'default' : 'outline'}
                onClick={() => setPeriodo('anual')}
                className={periodo === 'anual' ? 'bg-blue-900 hover:bg-blue-800' : ''}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Anual
              </Button>
              <Button
                variant={periodo === 'custom' ? 'default' : 'outline'}
                onClick={() => setPeriodo('custom')}
                className={periodo === 'custom' ? 'bg-blue-900 hover:bg-blue-800' : ''}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Personalizado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seleção de Datas Personalizadas */}
        {periodo === 'custom' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicioCustom}
                    onChange={(e) => setDataInicioCustom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFimCustom}
                    onChange={(e) => setDataFimCustom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={fetchFaturamento}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                  >
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão Gerar Relatório */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Button
              onClick={gerarRelatorio}
              className="w-full bg-blue-900 hover:bg-blue-800"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Gerar Relatório de Vendas
            </Button>
          </CardContent>
        </Card>

        {/* Período Atual com Navegação e Seleção */}
        {periodo !== 'custom' && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {periodo !== 'diario' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => navegarPeriodo('anterior')}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-medium text-blue-900">
                      {formatarPeriodo(periodo, dataSelecionada)}
                    </span>
                  </div>

                {periodo !== 'diario' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => navegarPeriodo('proximo')}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
              
              {periodo === 'mensal' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="anoSelect">Ano:</Label>
                  <select
                    id="anoSelect"
                    value={anoSelecionado}
                    onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    {anos.map((ano) => (
                      <option key={ano} value={ano}>{ano}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {periodo === 'anual' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="anoSelect">Ano:</Label>
                  <select
                    id="anoSelect"
                    value={anoSelecionado}
                    onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    {anos.map((ano) => (
                      <option key={ano} value={ano}>{ano}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
 )}
        {/* Modal de Relatório */}
        {mostrarRelatorio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle>Relatório de Vendas - {formatarPeriodo(periodo, dataSelecionada)}</CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setMostrarRelatorio(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent className="overflow-auto max-h-[70vh]">
                {loadingRelatorio ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Carregando vendas...</div>
                  </div>
                ) : vendasRelatorio.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Nenhuma venda encontrada neste período
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendasRelatorio.map((venda) => (
                      <Card key={venda.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Venda #{venda.id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(venda.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">R$ {venda.total.toFixed(2)}</p>
                            {venda.descontoTotal && venda.descontoTotal > 0 && (
                              <p className="text-sm text-orange-600">Desconto: R$ {venda.descontoTotal.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium mb-2">Itens:</p>
                          {venda.itens?.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm py-1">
                              <span>{item.produto?.nome} x{item.quantidade}</span>
                              <span>R$ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : faturamento ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Faturado */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Total Faturado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R$ {faturamento.total.toFixed(2)}
                </div>
                {faturamento.totalOriginal > faturamento.total && (
                  <div className="text-sm text-gray-400 line-through mt-1">
                    R$ {faturamento.totalOriginal.toFixed(2)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Desconto Total */}
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <ArrowDown className="w-4 h-4 text-orange-600" />
                  Desconto Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  R$ {faturamento.descontoTotal.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            {/* Quantidade de Vendas */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {faturamento.quantidadeVendas}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Médio */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-purple-600" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  R$ {faturamento.ticketMedio.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum dado de faturamento encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
