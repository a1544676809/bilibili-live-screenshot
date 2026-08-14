import { getFriendlyTitle } from '@/core/utils/title'

const canvas = document.createElement('canvas')
const padStart = (value: number) => value.toString().padStart(2, '0')

export class LiveScreenshot {
  readonly mimeType = 'image/png'
  url = ''
  blob: Blob
  timeStamp = new Date().getTime()
  constructor(public video: HTMLVideoElement) {
    this.createUrl()
  }
  async createUrl() {
    const { logError } = await import('@/core/utils/log')
    canvas.width = this.video.videoWidth
    canvas.height = this.video.videoHeight
    const context = canvas.getContext('2d')
    if (context === null) {
      logError('直播截图失败: canvas 未创建或创建失败.')
      return
    }
    context.drawImage(this.video, 0, 0)
    try {
      canvas.toBlob(blob => {
        if (blob === null) {
          logError('直播截图失败: 创建 blob 失败.')
          return
        }
        this.blob = blob
        this.url = URL.createObjectURL(blob)
      }, this.mimeType)
    } catch (error) {
      logError('直播截图失败: 操作被浏览器阻止, 无法创建截图.')
    }
  }
  get filename() {
    return `${getFriendlyTitle()} @${this.time.replace(/:/g, '-')} ${this.timeStamp.toString()}.png`
  }
  get id() {
    return this.timeStamp.toString()
  }
  get time() {
    const date = new Date(this.timeStamp)
    return `${padStart(date.getHours())}:${padStart(date.getMinutes())}:${padStart(
      date.getSeconds(),
    )}`
  }
  revoke() {
    URL.revokeObjectURL(this.url)
  }
}
