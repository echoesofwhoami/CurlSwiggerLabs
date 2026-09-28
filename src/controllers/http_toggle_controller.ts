import { Controller } from '@hotwired/stimulus'

export default class HttpToggleController extends Controller {
  static targets = ['tab', 'panel']

  declare readonly tabTargets: HTMLButtonElement[]

  declare readonly panelTargets: HTMLElement[]

  select(event: Event) {
    const tab = event.currentTarget

    if (!(tab instanceof HTMLButtonElement)) return

    const name = tab.dataset.panel

    if (!name) return

    this.show(name)
  }

  private show(name: string) {
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
  }
}
