import { defineComponentMetadata } from '@/components/define'
import { waitForControlBar } from '@/components/live/live-control-bar'
import { mountVueComponent } from '@/core/utils'
import { liveUrls } from '@/core/utils/urls'
import { LiveScreenshot } from './screenshot'
import ScreenshotContainer from './VideoScreenshotContainer.vue'

const ButtonClass = 'be-live-screenshot-btn'
const DisabledClass = 'be-live-screenshot-disabled'
const controlBarSelector =
  '.web-player-controller-wrap .control-area, .bilibili-live-player-video-controller .control-area'
const cameraIcon = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/></svg>`

let screenShotsList: Vue & {
  screenshots: LiveScreenshot[]
}
let button: HTMLElement | null = null
let insertTimer: number | null = null

const exitConfirmHandler = (e: BeforeUnloadEvent) => {
  if (screenShotsList?.screenshots.length > 0) {
    e.preventDefault()
  }
}

async function takeScreenshot() {
  const { logError } = await import('@/core/utils/log')
  const video = dq('#live-player video, .live-player-ctnr video') as HTMLVideoElement
  if (!(video instanceof HTMLVideoElement) || video.videoWidth === 0) {
    logError('直播截图失败: 无法定位视频元素, 请确认直播间正在播放.')
    return
  }
  const screenshot = new LiveScreenshot(video)
  if (!screenShotsList) {
    screenShotsList = mountVueComponent(ScreenshotContainer)
    document.body.insertAdjacentElement('beforeend', screenShotsList.$el)
  }
  screenShotsList.screenshots.unshift(screenshot)
}

const createButton = () => {
  if (button !== null) {
    return button
  }
  button = document.createElement('div')
  button.className = ButtonClass
  button.title = '截图'
  button.innerHTML = cameraIcon
  button.addEventListener('click', takeScreenshot)
  return button
}

const ensureButton = (controlBar: HTMLElement) => {
  if (dq(controlBar, `.${ButtonClass}`) !== null) {
    return
  }
  const anchor = dq(controlBar, '.left-area') ?? controlBar
  anchor.appendChild(createButton())
}

const tryInsertButton = () => {
  const controlBar = dq(controlBarSelector) as HTMLElement | null
  if (controlBar === null) {
    return
  }
  ensureButton(controlBar)
}

const startInserting = () => {
  waitForControlBar({
    callback: ensureButton,
  })
  insertTimer = window.setInterval(tryInsertButton, 2000)
}

const stopInserting = () => {
  if (insertTimer !== null) {
    clearInterval(insertTimer)
    insertTimer = null
  }
  button?.remove()
  button = null
}

const entry = async () => {
  startInserting()
  window.addEventListener('beforeunload', exitConfirmHandler)
}

export const component = defineComponentMetadata({
  name: 'liveScreenshot',
  displayName: '启用直播截图',
  tags: [componentsTags.live],
  instantStyles: [
    {
      name: 'liveScreenshot',
      style: () => import('./live-screenshot.scss'),
    },
  ],
  entry,
  urlInclude: liveUrls,
  reload: () => {
    document.body.classList.remove(DisabledClass)
    window.addEventListener('beforeunload', exitConfirmHandler)
    startInserting()
  },
  unload: () => {
    document.body.classList.add(DisabledClass)
    window.removeEventListener('beforeunload', exitConfirmHandler)
    stopInserting()
  },
})
