<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class BaseStepPage extends Vue {
  DISPLAY_STEP: number = 0

  @Prop({ type: Number, required: true })
  wizardStep!: Number

  get isThisStep (): boolean {
    return this.wizardStep === this.DISPLAY_STEP
  }
}
</script>
