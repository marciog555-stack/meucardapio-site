// Texto real da Hero, isolado num módulo .mjs puro (sem JSX/tipos) pra
// poder ser importado tanto pelo componente (via Vite) quanto pelo
// script de pré-renderização (scripts/prerender.mjs, que roda em Node puro
// depois do build) — evitando duplicar o texto em dois lugares.
export const HERO_EYEBROW = 'Cardápio digital pra restaurante, delivery e bar'

export const HERO_TITULO_LINHAS = [
  'Cardápio digital',
  'com pedido no WhatsApp',
  'pra restaurante em Anápolis',
]

export const HERO_SUBTITULO =
  'Um site profissional só seu: pedido direto no seu WhatsApp ou na mesa, pelo QR Code — sem pagar comissão por pedido pro aplicativo. E agora com o prato em 3D na mesa do cliente.'

export const HERO_CTA_TEXTO = 'Quero meu site'

export const HERO_WHATSAPP_NUMERO = '5562995471262'
export const HERO_WHATSAPP_MENSAGEM = 'Oi! Vi o MeuCardápioGo e quero um site assim pro meu restaurante.'
