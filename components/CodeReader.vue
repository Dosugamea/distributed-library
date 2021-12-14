<template>
  <!-- Entire code is from @kira_puka
    https://qiita.com/kira_puka/items/03dc5c01bbbaffdb6e83
  -->
  <div v-if="active" class="dialog modal is-active">
    <div class="modal-background" />
    <div class="modal-content">
      <!-- カメラの映像を表示させるDIV -->
      <div id="camera-area" class="camera-area" />
    </div>
    <!-- 右上の閉じるボタン -->
    <button class="modal-close is-large" aria-label="close" @click.prevent.stop="onClickCancel" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'nuxt-property-decorator'
// @ts-ignore
import Quagga from 'quagga'

@Component
export default class ModalReader extends Vue {
  @Prop({ required: true }) active!: boolean

  /**
   * Vueインスタンス破棄時、カメラを起動していたらストップする
   */
  destroyed () {
    if (Quagga) { Quagga.stop() }
  }

  // ****************************************************
  // * watch
  // ****************************************************
  /**
   * this.activeを監視してQuaggaの開始/停止をする
   */
  @Watch('active')
  private onChangeActive (val: boolean) {
    this.$nextTick(() => {
      if (val) {
        // モーダル表示時、Quaggaを起動
        this.initQuagga()
      } else {
        Quagga.stop()
      }
    })
  }

  // ****************************************************
  // * methods
  // ****************************************************
  /**
   * Quaggaの初期化処理
   */
  private initQuagga () {
    // バーコード検出時の処理を設定
    Quagga.onDetected(this.onDetected)

    // Quaggaの設定項目
    const config = {
      // カメラの映像の設定
      inputStream: {
        type: 'LiveStream',
        // カメラ映像を表示するHTML要素の設定
        target: document.querySelector('#camera-area'),
        // バックカメラの利用を設定. (フロントカメラは"user")
        constraints: { facingMode: 'environment' },
        // 検出範囲の指定: 上下30%は対象外
        area: { top: '30%', right: '0%', left: '0%', bottom: '30%' }
      },
      // 解析するワーカ数の設定
      numOfWorkers: navigator.hardwareConcurrency || 4,
      // バーコードの種類を設定: ISBNは"ean_reader"
      decoder: { readers: ['ean_reader'] }
    }
    // 初期化の開始。合わせて、初期化後の処理を設定
    Quagga.init(config, this.onInitialize)
  }

  /**
   * Quaggaの初期化完了後の処理
   * errorがなければ、起動する
   */
  private onInitialize (error: any) {
    if (error) {
      // エラーがある場合は、キャンセルをEmitする
      console.error(`Error: ${error}`, error)
      this.onClickCancel()
      return
    }

    // エラーがない場合は、読み取りを開始
    console.info('Initialization finished. Ready to start')
    Quagga.start()
  }

  /**
   * バーコード検出時の処理
   */
  private onDetected (success: any) {
    // ISBNは'success.codeResult.code'から取得
    const isbn = success.codeResult.code
    // ISBNをEmitで返却する
    this.onSuccess(isbn)
  }

  // ****************************************************
  // * emit
  // ****************************************************
  @Emit('cancel')
  private onClickCancel () {}

  @Emit('success')
  private onSuccess (code: string) {
    return code
  }
}
</script>

<style lang="scss">
.camera-area {
  overflow: hidden;
  height: 300px;
  width: 300px;

  /**
   * 指定したDIV配下にvideoとcanvasが追加される
   * 4:3になるため、margin-topで調整
   */
  video, canvas {
    padding-left: 70px;
    width: 300px;
    height: 400px;
  }
}
</style>
