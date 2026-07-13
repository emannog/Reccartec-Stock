export interface ProdutoComDesconto {
  preco: number;
  desconto: number | null;
  tipoDesconto: string | null;
  dataFimDesconto: string | Date | null;
}

export function calcularPrecoComDesconto(produto: ProdutoComDesconto): number {
  if (!produto.desconto || produto.desconto === 0) return produto.preco;
  
  // Verificar se o desconto ainda é válido
  if (produto.dataFimDesconto) {
    const dataFim = new Date(produto.dataFimDesconto);
    const agora = new Date();
    if (agora > dataFim) return produto.preco;
  }
  
  if (produto.tipoDesconto === 'percentual') {
    return produto.preco - (produto.preco * (produto.desconto / 100));
  } else {
    return produto.preco - produto.desconto;
  }
}

export function temDescontoValido(produto: ProdutoComDesconto): boolean {
  if (!produto.desconto || produto.desconto === 0) return false;
  
  if (produto.dataFimDesconto) {
    const dataFim = new Date(produto.dataFimDesconto);
    const agora = new Date();
    return agora <= dataFim;
  }
  
  return true;
}

export function calcularDescontoAplicado(produto: ProdutoComDesconto, quantidade: number = 1): number | null {
  const precoOriginal = produto.preco;
  const precoComDesconto = calcularPrecoComDesconto(produto);
  const desconto = (precoOriginal - precoComDesconto) * quantidade;
  return desconto > 0 ? desconto : null;
}
