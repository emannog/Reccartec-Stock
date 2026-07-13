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
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
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
      setCategorias(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      setCategorias([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setConfirmMessage('Tem certeza que deseja excluir esta categoria?')
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
        
        if (response.ok) {
          setSuccessMessage('Categoria excluída com sucesso')
          setShowSuccess(true)
          fetchCategorias()
        } else {
          const error = await response.json()
          setErrorMessage(error.error || 'Erro ao excluir categoria')
          setShowError(true)
        }
      } catch (error) {
        console.error('Erro ao deletar categoria:', error)
        setErrorMessage('Erro ao excluir categoria')
        setShowError(true)
      }
      setShowConfirm(false)
    })
    setShowConfirm(true)
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
        setSuccessMessage('Categoria criada com sucesso')
        setShowSuccess(true)
        fetchCategorias()
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Erro ao criar categoria')
        setShowError(true)
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      setErrorMessage('Erro ao criar categoria')
      setShowError(true)
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
