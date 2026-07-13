import { Estatisticas } from '@/repositories/IEstatisticaRepository';

export interface IEstatisticaService {
  getEstatisticas(): Promise<Estatisticas>;
}
