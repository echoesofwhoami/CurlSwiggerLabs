import { Controller } from '@hotwired/stimulus'

export default class CopyCodeController extends Controller {
  static targets = ['code', 'button']

  static values = {
    copyLabel: { type: String, default: 'Copy' },
    copiedLabel: { type: String, default: 'Copied!' },
  }

  declare readonly codeTarget: HTMLElement

  declare readonly hasCodeTarget: boolean

  declare readonly buttonTarget: HTMLButtonElement

  declare readonly hasButtonTarget: boolean

  declare readonly copyLabelValue: string

  declare readonly copiedLabelValue: string

  private resetTimer = 0

  async copy() {
    if (!this.hasCodeTarget) return

    const text = this.codeTarget.textContent

    if (text === null) return

    await navigator.clipboard.writeText(text)

    this.setLabel(this.copiedLabelValue)

    window.clearTimeout(this.resetTimer)

    this.resetTimer = window.setTimeout(() => {
      this.setLabel(this.copyLabelValue)
    }, 700)
  }

  disconnect() {
    window.clearTimeout(this.resetTimer)

    this.resetTimer = 0
  }

  private setLabel(label: string) {
    if (!this.hasButtonTarget) return

    this.buttonTarget.textContent = label

    this.buttonTarget.setAttribute('aria-label', label)
  }
}
