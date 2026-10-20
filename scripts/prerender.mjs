// Injeta o conteúdo real da Hero (H1 + texto principal) dentro de
// dist/index.html depois do `vite build`, pra quem não executa JavaScript
// (robôs de busca) receber o HTML com o <h1> e o texto já visíveis — hoje
// o <div id="root"> chega vazio e só o React (client-side) preenche.
//
// Não precisa bater 100% com o que o React monta depois: no cliente,
// createRoot(...).render(...) substitui esse conteúdo inteiro (não é
// hydrateRoot), então não há aviso de hidratação — isso aqui é só a
// primeira pintura/SEO.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  HERO_EYEBROW,
  HERO_TITULO_LINHAS,
  HERO_SUBTITULO,
  HERO_CTA_TEXTO,
  HERO_WHATSAPP_NUMERO,
  HERO_WHATSAPP_MENSAGEM,
} from '../src/data/heroTexto.mjs'

const h = React.createElement
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distIndex = path.join(__dirname, '..', 'dist', 'index.html')

const linkWhatsapp = `https://wa.me/${HERO_WHATSAPP_NUMERO}?text=${encodeURIComponent(HERO_WHATSAPP_MENSAGEM)}`

const heroEstatica = h(
  'section',
  null,
  h(
    'div',
    null,
    h('p', null, HERO_EYEBROW),
    h(
      'h1',
      null,
      HERO_TITULO_LINHAS.map((linha) => h('span', { key: linha }, linha)),
    ),
    h('p', null, HERO_SUBTITULO),
    h('a', { href: linkWhatsapp, target: '_blank', rel: 'noopener noreferrer' }, HERO_CTA_TEXTO),
  ),
)

const htmlHero = renderToStaticMarkup(heroEstatica)

const html = readFileSync(distIndex, 'utf8')
const marcador = '<div id="root"></div>'

if (!html.includes(marcador)) {
  console.warn('[prerender] marcador do #root não encontrado em dist/index.html — build mudou, pulando prerender.')
  process.exit(0)
}

writeFileSync(distIndex, html.replace(marcador, `<div id="root">${htmlHero}</div>`))
console.log('[prerender] conteúdo da Hero injetado em dist/index.html pra robôs de busca.')
