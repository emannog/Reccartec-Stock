export interface Estatisticas {
  totalProdutos: number;
  vendasHoje: number;
  estoqueBaixo: number;
}

export interface IEstatisticaRepository {
  getEstatisticas(): Promise<Estatisticas>;
}
