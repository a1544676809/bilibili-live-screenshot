<template>
  <div class="live-screenshot-container">
    <transition-group class="live-screenshot-list" name="live-screenshot-list" tag="div">
      <VideoScreenshot
        v-for="screenshot of screenshots"
        :key="screenshot.id"
        :screenshot="screenshot"
        @discard="discard(screenshot)"
      ></VideoScreenshot>
    </transition-group>
    <div v-show="showBatch" class="live-screenshot-batch">
      <button @click="saveAll"><VIcon :size="18" icon="mdi-content-save"></VIcon>全部保存</button>
      <button @click="discardAll">
        <VIcon :size="18" icon="mdi-delete-forever"></VIcon>全部丢弃
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { getFriendlyTitle } from '@/core/utils/title'
import { DownloadPackage } from '@/core/download'
import { VIcon } from '@/ui'
import VideoScreenshot from './VideoScreenshot.vue'
import { LiveScreenshot } from './screenshot'

export default Vue.extend({
  components: {
    VIcon,
    VideoScreenshot,
  },
  data() {
    return {
      screenshots: [],
    }
  },
  computed: {
    showBatch() {
      return this.screenshots.length >= 2
    },
  },
  methods: {
    discard(screenshot: LiveScreenshot) {
      this.screenshots.splice(this.screenshots.indexOf(screenshot), 1)
      screenshot.revoke()
    },
    async saveAll() {
      const pack = new DownloadPackage()
      this.screenshots.forEach((it: LiveScreenshot) => {
        pack.add(it.filename, it.blob, {
          date: new Date(it.timeStamp),
        })
      })
      await pack.emit(`${getFriendlyTitle()}.zip`)
      this.discardAll()
    },
    discardAll() {
      this.screenshots.forEach((it: LiveScreenshot) => it.revoke())
      this.screenshots = []
    },
  },
})
</script>
<style lang="scss">
.live-screenshot-container {
  position: relative;
  --screenshot-width: 240px;
  --screenshot-width-negative: calc(0px - var(--screenshot-width));
  --screenshot-height: 135px;
  --thumbnail-margin-vertical: 12px;
  --thumbnail-margin-horizontal: 12px;
  --screenshot-list-width: calc(2 * var(--thumbnail-margin-horizontal) + var(--screenshot-width));
  body.be-live-screenshot-disabled & {
    display: none;
  }
  .live-screenshot-batch {
    position: fixed;
    bottom: var(--thumbnail-margin-vertical);
    right: var(--thumbnail-margin-horizontal);
    z-index: 20000;
    width: var(--screenshot-list-width);
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: space-between;

    button {
      background: #000c;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      outline: 0 !important;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      flex-grow: 1;
      .be-icon {
        margin-right: 4px;
      }
    }
  }
  .live-screenshot-list {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 20000;
    margin: var(--thumbnail-margin-vertical) var(--thumbnail-margin-horizontal);
    max-height: calc(100% - 3 * var(--thumbnail-margin-vertical) - 37px);
    width: var(--screenshot-list-width);
    background-color: #000c;
    border-radius: 8px;
    overflow: auto;
    scrollbar-width: none !important;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
      height: 0 !important;
      width: 0 !important;
    }
    > * {
      pointer-events: initial;
    }
    &-enter {
      opacity: 0;
      transform: translateX(var(--screenshot-width-negative));
    }
    &-leave-to {
      opacity: 0;
      transform: translateX(var(--screenshot-width));
    }
  }
}
</style>
