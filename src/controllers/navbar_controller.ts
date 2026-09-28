import { Controller } from '@hotwired/stimulus'

export default class NavbarController extends Controller<HTMLElement> {
  static targets = ['toggle', 'menu']

  static values = {
    openLabel: { type: String, default: 'Open menu' },
    closeLabel: { type: String, default: 'Close menu' },
  }

  declare readonly toggleTarget: HTMLButtonElement

  declare readonly hasToggleTarget: boolean

  declare readonly hasMenuTarget: boolean

  declare openLabelValue: string

  declare closeLabelValue: string

  private mobileQuery: MediaQueryList | undefined

  private readonly onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    if (!this.isOpen()) return

    this.setOpen(false)

    if (!this.hasToggleTarget) return

    this.toggleTarget.focus()
  }

  private readonly onPointerdown = (event: PointerEvent) => {
    if (!this.isOpen()) return

    const target = event.target

    if (!(target instanceof Node)) return

    if (this.element.contains(target)) return

    this.setOpen(false)
  }

  private readonly onMediaChange = () => {
    this.setOpen(false)
  }

  connect() {
    if (!this.hasToggleTarget) return

    if (!this.hasMenuTarget) return

    this.mobileQuery = window.matchMedia('(max-width: 640px)')

    this.mobileQuery.addEventListener('change', this.onMediaChange)

    document.addEventListener('keydown', this.onKeydown)

    document.addEventListener('pointerdown', this.onPointerdown)
  }

  disconnect() {
    if (this.mobileQuery) {
      this.mobileQuery.removeEventListener('change', this.onMediaChange)
    }

    document.removeEventListener('keydown', this.onKeydown)

    document.removeEventListener('pointerdown', this.onPointerdown)
  }

  toggle() {
    const open = !this.isOpen()

    this.setOpen(open)
  }

  close() {
    this.setOpen(false)
  }

  private isOpen(): boolean {
    if (!this.hasToggleTarget) return false

    return this.toggleTarget.getAttribute('aria-expanded') === 'true'
  }

  private setOpen(open: boolean) {
    if (!this.hasToggleTarget) return

    const next = this.mobileOpenState(open)

    this.element.classList.toggle('is-open', next)

    document.documentElement.classList.toggle('nav-menu-open', next)

    this.toggleTarget.setAttribute('aria-expanded', String(next))

    this.toggleTarget.setAttribute('aria-label', this.menuLabel(next))
  }

  private mobileOpenState(open: boolean): boolean {
    if (!this.mobileQuery) return false

    if (!this.mobileQuery.matches) return false

    return open
  }

  private menuLabel(open: boolean): string {
    if (open) return this.closeLabelValue

    return this.openLabelValue
  }
}

export { NavbarController }
