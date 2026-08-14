declare module '@/components/define' {
  export const defineComponentMetadata: (metadata: any) => any
  export const defineOptionsMetadata: (metadata: any) => any
  export type OptionsOfMetadata<M> = any
}

declare module '@/components/live/live-control-bar' {
  export const waitForControlBar: (config: {
    init?: (container: HTMLElement) => void
    callback?: (controlBar: HTMLElement) => void
  }) => void
}

declare module '@/core/utils' {
  export const mountVueComponent: <T>(module: any, target?: Element | string) => Vue & T
}

declare module '@/core/utils/urls' {
  export const liveUrls: (string | RegExp)[]
}

declare module '@/core/utils/title' {
  export const getFriendlyTitle: (includesPageTitle?: boolean, extraVariables?: object) => string
}

declare module '@/core/utils/log' {
  export const logError: (...args: any[]) => void
}

declare module '@/core/download' {
  export class DownloadPackage {
    add(
      filename: string,
      blob: Blob,
      options?: { date?: Date; type?: string },
    ): void
    emit(filename: string): Promise<void>
  }
}

declare module '@/ui' {
  export const VIcon: any
}
