import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delayMs?: number
  as?: 'div' | 'li'
}

/** Revela o conteúdo uma vez, quando entra na tela — via IntersectionObserver
 * (não listener de scroll). Anima só opacity/transform. */
export function Reveal({ children, className = '', delayMs = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisivel(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.8,.3,1)] motion-reduce:transition-none ${
        visivel ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 motion-reduce:opacity-100'
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  )
}
