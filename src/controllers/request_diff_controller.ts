import { Controller, type ActionEvent } from '@hotwired/stimulus'

export default class RequestDiffController extends Controller {
  static targets = ['tab', 'panel', 'source', 'copyLabel', 'mobile', 'mobileCopy']

  static values = {
    idleLabel: { type: String, default: 'Copy' },
    copiedLabel: { type: String, default: 'Copied!' },
  }

  declare readonly tabTargets: HTMLButtonElement[]

  declare readonly panelTargets: HTMLElement[]

  declare readonly sourceTargets: HTMLTextAreaElement[]

  declare readonly copyLabelTargets: HTMLElement[]

  declare readonly mobileTarget: HTMLElement

  declare readonly hasMobileTarget: boolean

  declare readonly mobileCopyTarget: HTMLButtonElement

  declare readonly hasMobileCopyTarget: boolean

  declare readonly idleLabelValue: string

  declare readonly copiedLabelValue: string

  private timers = new Map<HTMLButtonElement, number>()

  select(event: ActionEvent) {
    const name = event.params.panel

    if (typeof name !== 'string') return

    this.showPanel(name)
  }

  async copy(event: ActionEvent) {
    const button = event.currentTarget

    if (!(button instanceof HTMLButtonElement)) return

    const side = event.params.side

    if (typeof side !== 'string') return

    const source = this.sourceFor(side)

    if (!source) return

    const label = this.labelFor(button)

    if (!label) return

    await navigator.clipboard.writeText(source.value)

    this.showCopied(button, label)
  }

  disconnect() {
    for (const timer of this.timers.values()) {
      window.clearTimeout(timer)
    }

    this.timers.clear()
  }

  private showPanel(name: string) {
    if (this.hasMobileTarget) this.mobileTarget.dataset.active = name

    for (const tab of this.tabTargets) {
      const selected = tab.dataset.panel === name

      tab.classList.toggle('is-active', selected)

      if (selected) {
        tab.setAttribute('aria-selected', 'true')
      } else {
        tab.setAttribute('aria-selected', 'false')
      }
    }

    for (const panel of this.panelTargets) {
      if (panel.dataset.panel === name) {
        panel.removeAttribute('hidden')
      } else {
        panel.setAttribute('hidden', '')
      }
    }

    if (this.hasMobileCopyTarget) {
      this.mobileCopyTarget.setAttribute('data-request-diff-side-param', name)
    }

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  }

  private sourceFor(side: string): HTMLTextAreaElement | undefined {
    for (const source of this.sourceTargets) {
      if (source.dataset.side === side) return source
    }
  }

  private labelFor(button: HTMLButtonElement): HTMLElement | undefined {
    for (const label of this.copyLabelTargets) {
      if (button.contains(label)) return label
    }
  }

  private showCopied(button: HTMLButtonElement, label: HTMLElement) {
    label.textContent = this.copiedLabelValue

    const existing = this.timers.get(button)

    if (existing) window.clearTimeout(existing)

    const timer = window.setTimeout(() => {
      label.textContent = this.idleLabelValue

      this.timers.delete(button)
    }, 700)

    this.timers.set(button, timer)
  }
}
