const WHATSAPP = '5562995471262'
const MENSAGEM = encodeURIComponent('Oi! Tenho uma dúvida sobre a política de privacidade do MeuCardápio.')

export function PoliticaPrivacidade() {
  return (
    <div className="bg-carvao text-creme min-h-screen px-6 py-12 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-creme/50 text-sm hover:text-creme">
          ← Voltar
        </a>

        <h1 className="font-display text-creme mt-6 text-3xl uppercase">Política de Privacidade</h1>
        <p className="text-creme/50 mt-2 text-sm">MeuCardápio — atualizada em 22/08/2026</p>

        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-burger mb-1 font-semibold">1. Sobre este site</h2>
            <p>
              Este site é a apresentação do MeuCardápio, um sistema de pedidos que restaurantes
              contratam pra ter site próprio. Ele não tem formulário de cadastro nem login — a
              única forma de contato é o botão que abre o WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-burger mb-1 font-semibold">2. O que acontece quando você clica no WhatsApp</h2>
            <p>
              O botão abre uma conversa direto no seu WhatsApp com uma mensagem pronta. A partir
              daí, os dados trocados (seu número, nome, o que você escrever) ficam na sua conversa
              normal de WhatsApp — não temos acesso a nada disso além do que você mesmo nos envia
              ali.
            </p>
          </section>

          <section>
            <h2 className="text-burger mb-1 font-semibold">3. Cookies e rastreamento</h2>
            <p>
              Este site não usa cookies de rastreamento, pixels de anúncio nem ferramentas de
              analytics de terceiros. Não guardamos nada no seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-burger mb-1 font-semibold">4. Se você já é cliente MeuCardápio</h2>
            <p>
              Se o seu restaurante já usa o MeuCardápio, o site que seus clientes acessam pra pedir
              tem sua própria Política de Privacidade (em <code className="text-creme/70">/privacidade</code>{' '}
              no seu site), explicando como os dados de quem pede com você são tratados.
            </p>
          </section>

          <section>
            <h2 className="text-burger mb-1 font-semibold">5. Seus direitos (LGPD)</h2>
            <p>
              Qualquer dúvida sobre privacidade, ou pedido relacionado aos seus dados, pode ser
              feito diretamente pelo WhatsApp abaixo.
            </p>
          </section>

          <section>
            <h2 className="text-burger mb-1 font-semibold">6. Alterações</h2>
            <p>Podemos atualizar esta política. A data no topo mostra a última alteração.</p>
          </section>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP}?text=${MENSAGEM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border-creme/30 text-creme hover:bg-creme hover:text-carvao mt-10 inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}
