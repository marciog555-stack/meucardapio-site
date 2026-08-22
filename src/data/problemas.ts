export interface Problema {
  titulo: string
  descricao: string
}

export const PROBLEMAS: Problema[] = [
  {
    titulo: 'Até 30% de comissão',
    descricao: 'Por pedido. Todo mês. Comendo a margem que devia ser sua.',
  },
  {
    titulo: 'O cliente é do app, não é seu',
    descricao: 'Sem WhatsApp, sem contato, sem jeito de chamar de volta.',
  },
  {
    titulo: 'Sua marca some no meio de mil outras',
    descricao: 'Seu restaurante é só mais um card na lista do concorrente.',
  },
  {
    titulo: 'Fidelidade de mentira',
    descricao: 'Pontos que só existem dentro do app — não são seus, não valem nada se você sair.',
  },
]
