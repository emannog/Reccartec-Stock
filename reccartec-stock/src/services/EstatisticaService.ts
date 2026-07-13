import { IEstatisticaService } from './IEstatisticaService';
import { IEstatisticaRepository } from '@/repositories/IEstatisticaRepository';
import { EstatisticaRepository } from '@/repositories/EstatisticaRepository';
import { Estatisticas } from '@/repositories/IEstatisticaRepository';

export class EstatisticaService implements IEstatisticaService {
  constructor(
    private estatisticaRepository: IEstatisticaRepository = new EstatisticaRepository()
  ) {}

  async getEstatisticas(): Promise<Estatisticas> {
    return await this.estatisticaRepository.getEstatisticas();
  }
}
