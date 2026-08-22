export interface Segmento {
  id: string
  nome: string
  cor: string
  foto: string
  descricao: string
  link: string
}

/** Os 3 exemplos são sites reais, no ar, rodando no MeuCardápio — não é
 * mockup. Por isso cada um tem um link pra visitar de verdade. */
export const SEGMENTOS: Segmento[] = [
  {
    id: 'massas',
    nome: 'Massas & Marmitas',
    cor: 'var(--color-macarrao)',
    foto: '/img/demo-macarrao.webp',
    descricao: 'Cardápio configurável — o cliente monta o próprio prato.',
    link: 'https://skin-o-hamburgueria.vercel.app/',
  },
  {
    id: 'marmitaria',
    nome: 'Marmitaria',
    cor: 'var(--color-marmita)',
    foto: '/img/demo-bistro.webp',
    descricao: 'Cardápio que muda todo dia, sem precisar mexer em nada.',
    link: 'https://skin-o-hamburgueria-svc7.vercel.app/',
  },
  {
    id: 'hamburgueria',
    nome: 'Hamburgueria',
    cor: 'var(--color-burger)',
    foto: '/img/demo-brasa.webp',
    descricao: 'Fidelidade automática pra quem já é cliente.',
    link: 'https://skin-o-hamburgueria-brasa-e-cia.vercel.app/',
  },
]
