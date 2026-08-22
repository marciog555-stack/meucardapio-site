import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/** As fontes (Anton/Manrope) carregam depois do primeiro paint — quando
 * trocam da fonte de sistema, o texto muda de tamanho e empurra o resto da
 * página. Sem isso, o ScrollTrigger fica com a posição antiga dos gatilhos
 * e "erra" onde cada seção começa, dando a sensação de puxão na rolagem. */
export function useAtualizarScrollAposFontes() {
  useEffect(() => {
    if (!('fonts' in document)) return
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])
}
