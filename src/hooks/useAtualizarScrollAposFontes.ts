import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/** Os gatilhos de scroll (GSAP) são calculados com a altura da página no
 * momento em que o componente monta — mas fontes e imagens ainda estão
 * carregando nessa hora, então a altura final só fica certa depois. Sem
 * recalcular, o gatilho de uma seção lá embaixo (tipo o gráfico) fica
 * baseado numa altura antiga e só "acerta" muito depois, quando alguma
 * outra coisa força um recálculo — daí a sensação de demora. */
export function useAtualizarScrollAposFontes() {
  useEffect(() => {
    const recalcular = () => ScrollTrigger.refresh()

    if ('fonts' in document) {
      document.fonts.ready.then(recalcular)
    }

    if (document.readyState === 'complete') {
      recalcular()
    } else {
      window.addEventListener('load', recalcular)
    }

    // Rede lenta pode levar mais que isso pra terminar de baixar imagem —
    // essa é só uma rede de segurança, não a correção principal.
    const timeout = window.setTimeout(recalcular, 2000)

    return () => {
      window.removeEventListener('load', recalcular)
      window.clearTimeout(timeout)
    }
  }, [])
}
