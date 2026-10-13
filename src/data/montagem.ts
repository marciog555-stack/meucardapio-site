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
    titulo: 'Pedido no WhatsApp ou na mesa',
    descricao:
      'Delivery cai direto no seu WhatsApp, com Pix na sua chave (sem taxa). Pedido da mesa cai no painel, com som e impressora.',
  },
  {
    titulo: 'Fidelidade automática',
    descricao: 'Pontos somam sozinhos a cada pedido. O cliente consulta só com o WhatsApp — sem senha, sem cartão.',
  },
  {
    titulo: 'Promoções e horários',
    descricao: 'Combo do dia, promoção por dia da semana e horário de funcionamento — o site abre e fecha sozinho.',
  },
  {
    titulo: 'Desempenho na palma da mão',
    descricao: 'Quanto vendeu hoje, os pratos que mais saem e os horários de pico, direto no painel.',
  },
]
