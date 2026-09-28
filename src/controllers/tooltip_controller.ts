import { Controller } from '@hotwired/stimulus'
import type { ClientTip } from '@types'

const SHOW_DELAY_MS = 180

const HIDE_DELAY_MS = 140

const VIEWPORT_PAD = 12

const GAP = 8

export default class TooltipController extends Controller {
  static targets = ['glossary', 'panel', 'term', 'short', 'code', 'links', 'link']

  static values = {
    learnMore: { type: String, default: 'Learn more' },
    decodedTerm: { type: String, default: 'Decoded' },
    signatureTerm: { type: String, default: 'Signature' },
  }

  declare readonly glossaryTarget: HTMLScriptElement

  declare readonly hasGlossaryTarget: boolean

  declare readonly panelTarget: HTMLElement

  declare readonly hasPanelTarget: boolean

  declare readonly termTarget: HTMLElement

  declare readonly hasTermTarget: boolean

  declare readonly shortTarget: HTMLElement

  declare readonly hasShortTarget: boolean

  declare readonly codeTarget: HTMLElement

  declare readonly hasCodeTarget: boolean

  declare readonly linksTarget: HTMLElement

  declare readonly hasLinksTarget: boolean

  declare readonly linkTarget: HTMLTemplateElement

  declare readonly hasLinkTarget: boolean

  declare readonly learnMoreValue: string

  declare readonly decodedTermValue: string

  declare readonly signatureTermValue: string

  private glossary: Record<string, ClientTip> = {}

  private currentTrigger: HTMLElement | null = null

  private pinned = false

  private showTimer = 0

  private hideTimer = 0

  connect() {
    this.loadGlossary()

    document.addEventListener('keydown', this.handleKeydown)

    document.addEventListener('pointerdown', this.handlePointerDown)

    window.addEventListener('scroll', this.handleReposition, true)

    window.addEventListener('resize', this.handleReposition)
  }

  disconnect() {
    this.clearTimers()

    document.removeEventListener('keydown', this.handleKeydown)

    document.removeEventListener('pointerdown', this.handlePointerDown)

    window.removeEventListener('scroll', this.handleReposition, true)

    window.removeEventListener('resize', this.handleReposition)
  }

  enter(event: Event) {
    const trigger = this.triggerFrom(event)

    if (!trigger) return

    window.clearTimeout(this.hideTimer)

    this.hideTimer = 0

    if (this.pinned && this.currentTrigger !== trigger) return

    this.scheduleShow(trigger)
  }

  leave() {
    window.clearTimeout(this.showTimer)

    this.showTimer = 0

    if (!this.pinned) this.scheduleHide()
  }

  focusIn(event: Event) {
    const trigger = this.triggerFrom(event)

    if (!trigger) return

    window.clearTimeout(this.hideTimer)

    this.hideTimer = 0

    this.showPanel(trigger)
  }

  focusOut(event: Event) {
    if (!(event instanceof FocusEvent)) return

    const next = event.relatedTarget

    if (this.hasPanelTarget && next instanceof Node && this.panelTarget.contains(next)) return

    if (!this.pinned) this.scheduleHide()
  }

  pin(event: Event) {
    const trigger = this.triggerFrom(event)

    if (!trigger) return

    event.preventDefault()

    event.stopPropagation()

    window.clearTimeout(this.showTimer)

    this.showTimer = 0

    if (this.pinned && this.currentTrigger === trigger) {
      this.hidePanel()

      return
    }

    this.pinned = true

    this.showPanel(trigger)
  }

  keydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) return

    if (event.key !== 'Tab') return

    if (event.shiftKey) return

    if (!this.pinned) return

    const trigger = event.currentTarget

    if (!(trigger instanceof HTMLElement)) return

    if (this.currentTrigger !== trigger) return

    if (!this.hasPanelTarget) return

    const firstLink = this.panelTarget.querySelector('a')

    if (!(firstLink instanceof HTMLAnchorElement)) return

    event.preventDefault()

    firstLink.focus()
  }

  hold() {
    window.clearTimeout(this.hideTimer)

    this.hideTimer = 0
  }

  release() {
    if (!this.pinned) this.scheduleHide()
  }

  private readonly handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    if (!this.hasPanelTarget) return

    if (this.panelTarget.hidden) return

    const trigger = this.currentTrigger

    this.hidePanel()

    if (trigger) trigger.focus()
  }

  private readonly handlePointerDown = (event: PointerEvent) => {
    if (!this.hasPanelTarget) return

    if (this.panelTarget.hidden) return

    const path = event.composedPath()

    if (path.includes(this.panelTarget)) return

    if (this.currentTrigger !== null && path.includes(this.currentTrigger)) return

    this.hidePanel()
  }

  private readonly handleReposition = () => {
    if (this.currentTrigger === null) return

    if (!this.hasPanelTarget) return

    if (this.panelTarget.hidden) return

    this.positionPanel(this.currentTrigger, this.panelTarget)
  }

  private loadGlossary() {
    this.glossary = {}

    if (!this.hasGlossaryTarget) return

    const raw = this.glossaryTarget.textContent

    if (raw === null) return

    const trimmed = raw.trim()

    if (!trimmed) return

    this.glossary = this.parseGlossary(trimmed)
  }

  private parseGlossary(raw: string): Record<string, ClientTip> {
    try {
      const parsed: unknown = JSON.parse(raw)

      if (typeof parsed !== 'object' || parsed === null) return {}

      if (Array.isArray(parsed)) return {}

      return parsed as Record<string, ClientTip>
    } catch {
      return {}
    }
  }

  private triggerFrom(event: Event): HTMLElement | undefined {
    const current = event.currentTarget

    if (current instanceof HTMLElement) return current
  }

  private tipTerm(trigger: HTMLElement, fallback: string): string {
    const term = trigger.dataset.tipTerm

    if (!term) return fallback

    return term
  }

  private readTip(trigger: HTMLElement): ClientTip | undefined {
    const decode = trigger.dataset.tipDecode

    if (decode) {
      return {
        kind: 'syntax',
        term: this.tipTerm(trigger, this.decodedTermValue),
        short: '',
        code: decode,
      }
    }

    const short = trigger.dataset.tipShort

    if (short) {
      return {
        kind: 'syntax',
        term: this.tipTerm(trigger, this.signatureTermValue),
        short,
      }
    }

    const id = trigger.dataset.tipId

    if (!id) return

    const entry = this.glossary[id]

    if (!entry) return

    return entry
  }

  private fillPanel(entry: ClientTip) {
    if (this.hasTermTarget) this.termTarget.textContent = entry.term

    this.showShort(entry)

    this.showCode(entry)

    this.fillLinks(entry)
  }

  private showShort(entry: ClientTip) {
    if (!this.hasShortTarget) return

    this.shortTarget.textContent = entry.short

    if (entry.code) {
      this.shortTarget.hidden = true

      return
    }

    this.shortTarget.hidden = false
  }

  private showCode(entry: ClientTip) {
    if (!this.hasCodeTarget) return

    if (entry.code) {
      this.codeTarget.textContent = entry.code

      this.codeTarget.hidden = false

      return
    }

    this.codeTarget.textContent = ''

    this.codeTarget.hidden = true
  }

  private fillLinks(entry: ClientTip) {
    if (!this.hasLinksTarget) return

    this.linksTarget.replaceChildren()

    this.linksTarget.setAttribute('aria-label', this.learnMoreValue)

    if (!entry.refs) return

    if (!this.hasLinkTarget) return

    const sample = this.linkTarget.content.querySelector('a')

    if (!(sample instanceof HTMLAnchorElement)) return

    for (const ref of entry.refs) {
      const link = sample.cloneNode(true)

      if (!(link instanceof HTMLAnchorElement)) continue

      link.href = ref.url

      link.textContent = ref.title

      this.linksTarget.appendChild(link)
    }
  }

  private navTopInset(): number {
    const nav = document.querySelector('[data-navbar]')

    if (!(nav instanceof HTMLElement)) return VIEWPORT_PAD

    const navRect = nav.getBoundingClientRect()

    if (navRect.bottom <= 0 || navRect.top >= window.innerHeight) return VIEWPORT_PAD

    if (navRect.top <= VIEWPORT_PAD) return Math.ceil(navRect.bottom) + VIEWPORT_PAD

    return VIEWPORT_PAD
  }

  private positionPanel(trigger: HTMLElement, panel: HTMLElement) {
    const rect = trigger.getBoundingClientRect()

    const panelWidth = panel.offsetWidth

    const panelHeight = panel.offsetHeight

    const vw = window.innerWidth

    const vh = window.innerHeight

    const topMin = this.navTopInset()

    const bottomMax = vh - VIEWPORT_PAD

    const below = rect.bottom + GAP

    const above = rect.top - GAP - panelHeight

    const belowFits = below >= topMin && below + panelHeight <= bottomMax

    const aboveFits = above >= topMin

    let top = below

    if (belowFits) {
      top = below
    } else if (aboveFits) {
      top = above
    } else {
      const spaceBelow = bottomMax - Math.max(below, topMin)

      const spaceAbove = rect.top - GAP - topMin

      if (spaceAbove > spaceBelow) {
        top = above
      } else {
        top = Math.max(below, topMin)
      }

      const maxTop = Math.max(topMin, bottomMax - panelHeight)

      top = Math.min(Math.max(top, topMin), maxTop)
    }

    let left = rect.left

    const maxLeft = vw - panelWidth - VIEWPORT_PAD

    left = Math.min(Math.max(VIEWPORT_PAD, left), Math.max(VIEWPORT_PAD, maxLeft))

    panel.style.top = `${Math.round(top)}px`

    panel.style.left = `${Math.round(left)}px`
  }

  private setExpanded(trigger: HTMLElement, expanded: boolean) {
    if (expanded) {
      trigger.setAttribute('aria-expanded', 'true')

      trigger.setAttribute('aria-describedby', 'csl-tip-popover')

      return
    }

    trigger.setAttribute('aria-expanded', 'false')

    trigger.removeAttribute('aria-describedby')
  }

  private hidePanel() {
    this.clearTimers()

    if (this.currentTrigger) this.setExpanded(this.currentTrigger, false)

    this.currentTrigger = null

    this.pinned = false

    if (!this.hasPanelTarget) return

    this.panelTarget.hidden = true

    this.panelTarget.style.visibility = ''
  }

  private scheduleHide() {
    window.clearTimeout(this.hideTimer)

    this.hideTimer = window.setTimeout(() => {
      if (this.pinned) return

      this.hidePanel()
    }, HIDE_DELAY_MS)
  }

  private scheduleShow(trigger: HTMLElement) {
    window.clearTimeout(this.showTimer)

    this.showTimer = window.setTimeout(() => {
      if (this.pinned && this.currentTrigger && this.currentTrigger !== trigger) return

      this.showPanel(trigger)
    }, SHOW_DELAY_MS)
  }

  private showPanel(trigger: HTMLElement) {
    const entry = this.readTip(trigger)

    if (!entry) return

    if (!this.hasPanelTarget) return

    window.clearTimeout(this.hideTimer)

    this.hideTimer = 0

    if (this.currentTrigger && this.currentTrigger !== trigger) {
      this.setExpanded(this.currentTrigger, false)
    }

    this.currentTrigger = trigger

    this.fillPanel(entry)

    this.panelTarget.style.visibility = 'hidden'

    this.panelTarget.hidden = false

    this.positionPanel(trigger, this.panelTarget)

    this.panelTarget.style.visibility = ''

    this.setExpanded(trigger, true)
  }

  private clearTimers() {
    window.clearTimeout(this.showTimer)

    window.clearTimeout(this.hideTimer)

    this.showTimer = 0

    this.hideTimer = 0
  }
}
