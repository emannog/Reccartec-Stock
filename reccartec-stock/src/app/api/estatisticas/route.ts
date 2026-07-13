import { NextResponse } from 'next/server'
import { EstatisticaService } from '@/services/EstatisticaService'

export async function GET() {
  try {
    const estatisticaService = new EstatisticaService()
    const estatisticas = await estatisticaService.getEstatisticas()

    return NextResponse.json(estatisticas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 })
  }
}
