import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Total de produtos
    const totalProdutos = await prisma.produto.count()

    // Vendas hoje (apenas concluídas)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)

    const vendasHoje = await prisma.venda.count({
      where: {
        createdAt: {
          gte: hoje,
          lt: amanha
        },
        status: 'CONCLUIDA'
      }
    })

    // Estoque baixo (produtos com quantidade <= minimo)
    const produtos = await prisma.produto.findMany()
    const estoqueBaixo = produtos.filter((p: any) => p.quantidade <= p.minimo).length

    return NextResponse.json({
      totalProdutos,
      vendasHoje,
      estoqueBaixo
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
