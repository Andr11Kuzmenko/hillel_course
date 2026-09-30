import { useRef } from 'react'

// Рахує, скільки разів компонент був відрендерений.
export function useRenderCount(name, log = false) {
  const count = useRef(0)
  count.current += 1
  if (log) {
    console.log(`[render] ${name}: ${count.current}`)
  }
  return count.current
}
