import Link from 'next/link'
import { Package, Folder, TrendingUp, ShoppingCart, Receipt, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Reccartec Stock
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de Gestão de Estoque
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Link href="/produtos" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Produtos</h2>
              </div>
              <p className="text-gray-600 mb-4">Gerencie seu catálogo de produtos</p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Acessar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/categorias" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Folder className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Categorias</h2>
              </div>
              <p className="text-gray-600 mb-4">Organize seus produtos por categorias</p>
              <div className="flex items-center text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">Acessar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/vendas" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold">Nova Venda</h2>
              </div>
              <p className="text-gray-600 mb-4">Registre vendas e saídas</p>
              <div className="flex items-center text-orange-600 group-hover:text-orange-700">
                <span className="text-sm font-medium">Acessar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/vendas/historico" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Histórico</h2>
              </div>
              <p className="text-gray-600 mb-4">Visualize todas as vendas</p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                <span className="text-sm font-medium">Acessar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
