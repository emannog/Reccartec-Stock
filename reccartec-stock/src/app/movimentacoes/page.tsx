'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrendingUp, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react'

interface Movimentacao {
  id: number
  tipo: string
  quantidade: number
  produto: {
    id: number
    nome: string
    codigo: number
  }
  motivo: string | null
  createdAt: string
}

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovimentacoes()
  }, [])

  const fetchMovimentacoes = async () => {
    try {
      const response = await fetch('/api/movimentacoes')
      const data = await response.json()
      setMovimentacoes(data)
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ENTRADA':
        return <ArrowDown className="w-5 h-5 text-green-600" />
      case 'SAIDA':
        return <ArrowUp className="w-5 h-5 text-red-600" />
      case 'AJUSTE':
        return <RefreshCw className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ENTRADA':
        return 'bg-green-100 text-green-800'
      case 'SAIDA':
        return 'bg-red-100 text-red-800'
      case 'AJUSTE':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Movimentações</h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {movimentacoes.map((movimentacao) => (
            <Card key={movimentacao.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gray-100">
                      {getTipoIcon(movimentacao.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{movimentacao.produto.nome}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(movimentacao.tipo)}`}>
                          {movimentacao.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Cód: {movimentacao.produto.codigo}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantidade: <span className="font-medium">{movimentacao.quantidade}</span>
                      </p>
                      {movimentacao.motivo && (
                        <p className="text-sm text-gray-600 mt-1">
                          Motivo: {movimentacao.motivo}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(movimentacao.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {movimentacoes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma movimentação encontrada</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
