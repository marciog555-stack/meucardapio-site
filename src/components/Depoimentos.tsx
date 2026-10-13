import { useEffect, useState } from 'react'
import { Reveal } from './Reveal'

// Chave pública (publishable) do Supabase — a mesma que vai nos sites dos
// clientes. A função só devolve avaliações aprovadas pelo Márcio.
const SUPABASE_URL = 'https://ieqlhqpfbwpndfqzptke.supabase.co'
const SUPABASE_CHAVE = 'sb_publishable_9TZZJJtQnNQTuuQkmqgHkA_cOVXVyCD'

interface Avaliacao {
  restaurante_nome: string
  nota: number
  comentario: string
  nome_autor: string
  site_url: string | null
}

/**
 * Avaliações REAIS dos restaurantes que usam o MeuCardápioGo — enviadas pelo
 * dono no painel e aprovadas pelo Márcio. Nada é inventado: sem avaliação
 * aprovada (ou se a busca falhar), a seção simplesmente não aparece.
 */
export function Depoimentos() {
  const [lista, setLista] = useState<Avaliacao[]>([])

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/rpc/avaliacoes_publicas`, {
      method: 'POST',
      headers: { apikey: SUPABASE_CHAVE, Authorization: `Bearer ${SUPABASE_CHAVE}`, 'Content-Type': 'application/json' },
      body: '{}',
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((dados: Avaliacao[]) => setLista(Array.isArray(dados) ? dados : []))
      .catch(() => setLista([]))
  }, [])

  if (lista.length === 0) return null

  return (
    <section id="avaliacoes" className="px-6 py-24 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-creme/65 text-xs font-semibold tracking-[0.3em] uppercase">Quem usa, recomenda</p>
          <h2 className="font-display text-creme mt-3 text-4xl uppercase sm:text-5xl">
            Restaurantes que já estão no ar
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((a, i) => (
            <Reveal key={`${a.restaurante_nome}-${i}`} as="li" delayMs={60 * (i % 3)}>
              <figure className="border-creme/10 bg-carvao-claro flex h-full flex-col rounded-2xl border p-6">
                <p className="text-macarrao text-xl tracking-wider" aria-label={`${a.nota} de 5 estrelas`}>
                  {'★'.repeat(a.nota)}
                  <span className="text-creme/20">{'★'.repeat(5 - a.nota)}</span>
                </p>
                {a.comentario && (
                  <blockquote className="text-creme/85 mt-3 flex-1 text-base whitespace-pre-line">
                    “{a.comentario}”
                  </blockquote>
                )}
                <figcaption className="mt-5">
                  <p className="text-creme font-semibold">{a.restaurante_nome}</p>
                  {a.nome_autor && <p className="text-creme/65 text-sm">{a.nome_autor}</p>}
                  {a.site_url && (
                    <a
                      href={a.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-macarrao mt-2 inline-flex text-sm font-semibold"
                    >
                      Ver o site →
                    </a>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
