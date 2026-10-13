export interface Demo {
  nome: string
  tipo: string
  cor: string
  foto: string
  descricao: string
  link: string
  dica: string
}

/** Lojas de DEMONSTRAÇÃO do MeuCardápioGo (cardápio de exemplo) — rodando no
 * mesmo sistema dos clientes, no ar de verdade. Não são clientes reais. */
export const DEMOS: Demo[] = [
  {
    nome: 'Resenha Bar & Petiscaria',
    tipo: 'Bar · atende só na mesa',
    cor: '#D9A441',
    foto: '/img/demo-resenha.webp',
    descricao:
      'QR Code na mesa, pedido direto pra cozinha, chamar garçom, comandas separadas e prato em 3D. Sem delivery, sem WhatsApp.',
    link: 'https://skin-o-hamburgueria-resenha-bar.vercel.app/?mesa=7',
    dica: 'Abre como se você estivesse na mesa 7',
  },
  {
    nome: 'Brasa & Cia',
    tipo: 'Hamburgueria · delivery + mesa',
    cor: 'var(--color-burger)',
    foto: '/img/demo-brasa.webp',
    descricao:
      'Cardápio com fotos, pedido direto no WhatsApp, Pix do próprio dono, fidelidade automática e lanche girando em 360°.',
    link: 'https://skin-o-hamburgueria-brasa-e-cia.vercel.app/',
    dica: 'Faça um pedido de teste',
  },
]
