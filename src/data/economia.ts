/** Números ilustrativos pra mostrar a diferença de custo — ticket médio e
 * comissão são valores típicos de app de delivery no Brasil, não dado de
 * cliente real. */
export const TICKET_MEDIO = 45
export const COMISSAO_APP = 0.25
export const PRECO_MENSAL = 50

export interface FaixaPedidos {
  pedidos: number
  custoApp: number
  custoMeuCardapio: number
}

export const FAIXAS_PEDIDOS: FaixaPedidos[] = [50, 100, 200].map((pedidos) => ({
  pedidos,
  custoApp: Math.round(pedidos * TICKET_MEDIO * COMISSAO_APP),
  custoMeuCardapio: PRECO_MENSAL,
}))
