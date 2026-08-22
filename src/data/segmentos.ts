export interface Segmento {
  nome: string
  cor: string
  foto: string
  descricao: string
  link: string
}

/** Exemplo real, no ar, rodando no MeuCardápio — não é mockup. */
export const SEGMENTO_DESTAQUE: Segmento = {
  nome: 'Brasa & Cia',
  cor: 'var(--color-burger)',
  foto: '/img/demo-brasa.webp',
  descricao:
    'Cardápio, fidelidade automática e pedido direto no WhatsApp — tudo rodando de verdade, hoje.',
  link: 'https://skin-o-hamburgueria-brasa-e-cia.vercel.app/',
}
