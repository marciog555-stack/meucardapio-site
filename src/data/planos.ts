/** Preços oficiais — o que está aqui é o que o Márcio cobra de verdade. */
export const PRECO_PRIMEIRO_MES = 150
export const PRECO_MONTAGEM = 100
export const PRECO_MENSAL = 50

/** Add-on MeuCardápio 3D (3D, realidade aumentada, giro 360° e atendimento
 * na mesa). Valores definidos pelo Márcio. */
export const PRECO_360_MENSAL: number | null = 39

export interface ItemTabela3D {
  item: string
  preco: number
  detalhe?: string
}

/** Implantação dos pratos em 3D/360° — cobrança única, por pacote ou avulso. */
export const TABELA_3D: ItemTabela3D[] = [
  { item: 'Pacote 5 pratos em 3D', preco: 290 },
  { item: 'Pacote 10 pratos em 3D', preco: 490 },
  { item: 'Prato extra ou troca de prato', preco: 50 },
  { item: 'Drink ou item em giro 360° (vídeo)', preco: 25 },
]
