'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Folder, Plus, Edit, Trash2 } from 'lucide-react'

interface Categoria {
  id: number
  nome: string
  descricao: string | null
  produtos: any[]
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  })

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
        fetchCategorias()
      } catch (error) {
        console.error('Erro ao deletar categoria:', error)
      }
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao || null
        })
      })
      
      if (response.ok) {
        setShowModal(false)
        setFormData({
          nome: '',
          descricao: ''
        })
        fetchCategorias()
      } else {
        alert('Erro ao criar categoria')
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      alert('Erro ao criar categoria')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      nome: '',
      descricao: ''
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Categorias</h1>
            <p className="text-gray-600 mt-1">Organize seus produtos por categorias</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="w-full md:w-auto bg-blue-900 hover:bg-blue-800">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((categoria) => (
            <Card key={categoria.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <span className="text-lg">{categoria.nome}</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(categoria.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categoria.descricao && (
                    <p className="text-sm text-gray-600">{categoria.descricao}</p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Produtos:</span>
                    <span className="font-medium">{categoria.produtos.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categorias.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Folder className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma categoria encontrada</p>
            </CardContent>
          </Card>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Nova Categoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da categoria"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição da categoria"
                  />
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
