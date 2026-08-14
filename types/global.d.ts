import { VueConstructor } from 'vue'

declare global {
  const Vue: VueConstructor
  type Vue = import('vue/types/umd')
  const dq: (rootOrSelector: Element | string, selector?: string) => HTMLElement | null
  const componentsTags: Record<string, { name: string; displayName: string }>
}

export {}
