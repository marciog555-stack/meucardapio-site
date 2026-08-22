export interface PassoFuncionamento {
  titulo: string
  descricao: string
}

export const PASSOS_FUNCIONAMENTO: PassoFuncionamento[] = [
  {
    titulo: 'Seu cardápio, do seu jeito',
    descricao: 'Você mesmo cadastra e edita categorias, preços e fotos — sem depender de ninguém.',
  },
  {
    titulo: 'Pedido cai direto no seu WhatsApp',
    descricao: 'Sem intermediário, sem taxa por pedido, sem esperar aprovação de app nenhum.',
  },
  {
    titulo: 'Cliente monta o próprio prato',
    descricao: 'Massa, molho, carne, guarnição — configurável do jeito que seu cardápio precisar.',
  },
  {
    titulo: 'Fidelidade automática',
    descricao: 'Pontos somam sozinhos a cada pedido. O cliente consulta só com o WhatsApp — sem senha, sem cartão.',
  },
  {
    titulo: 'Painel completo',
    descricao: 'Pedidos do dia, faturamento em PDF, promoções, bairros de entrega — tudo num lugar só.',
  },
]
