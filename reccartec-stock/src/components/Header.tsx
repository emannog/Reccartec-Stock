'use client'

import Link from 'next/link'
import { Package, Folder, Receipt, Home, TrendingUp, DollarSign } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Logo SVG - RECCARTEC */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Seta esquerda */}
                <path
                  d="M 20 50 Q 20 20 50 20 Q 70 20 70 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="group-hover:stroke-blue-200 transition-colors"
                />
                <polygon
                  points="20,50 35,40 35,60"
                  fill="white"
                  className="group-hover:fill-blue-200 transition-colors"
                />
                
                {/* Seta direita */}
                <path
                  d="M 80 50 Q 80 80 50 80 Q 30 80 30 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="group-hover:stroke-blue-200 transition-colors"
                />
                <polygon
                  points="80,50 65,40 65,60"
                  fill="white"
                  className="group-hover:fill-blue-200 transition-colors"
                />
              </svg>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold tracking-tight">RECCARTEC</h1>
              <p className="text-xs text-blue-200 tracking-wide">RECARGA DE CARTUCHOS TÉCNICOS</p>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>
            <Link
              href="/produtos"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Produtos</span>
            </Link>
            <Link
              href="/categorias"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <Folder className="w-4 h-4" />
              <span className="hidden sm:inline">Categorias</span>
            </Link>
            <Link
              href="/vendas/historico"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </Link>
            <Link
              href="/movimentacoes"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Movimentações</span>
            </Link>
            <Link
              href="/faturamento"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Faturamento</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
