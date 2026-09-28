import { Controller } from '@hotwired/stimulus'
import {
  apply as applyConfig,
  DEFAULT_CONFIG,
  deleteSaved as deleteSavedConfig,
  getActive,
  getPreset,
  listSaved,
  matchPresetId,
  resetToDefault,
  save as saveConfig,
  type ThemeConfig,
} from '../scripts/theme-config'

const THEME_KEYS = new Set<string>([
  'pageBg',
  'surface',
  'surfaceElevated',
  'border',
  'borderMuted',
  'text',
  'textMuted',
  'heading',
  'accent',
  'accentHover',
  'accentSoft',
  'fontSans',
  'fontSizeBase',
  'lineHeight',
  'contentMaxWidth',
  'contentGap',
  'radius',
  'codeBg',
  'codeInlineBg',
  'codeInlineFg',
  'codeFontSize',
  'codePlaceholder',
  'shikiTheme',
])

function isThemeKey(value: string): value is keyof ThemeConfig {
  return THEME_KEYS.has(value)
}

function fieldKey(el: HTMLElement): keyof ThemeConfig | undefined {
  const key = el.dataset.field

  if (!key) return

  if (!isThemeKey(key)) return

  return key
}

function writeThemeValue(config: ThemeConfig, key: keyof ThemeConfig, value: string | number): void {
  Object.assign(config, { [key]: value })
}

function readoutText(key: keyof ThemeConfig, value: string | number): string {
  if (key === 'contentGap') return `${value}rem`

  if (key === 'contentMaxWidth') return `${value}px`

  if (key === 'radius') return `${value}px`

  if (key === 'fontSizeBase') return `${value}px`

  if (key === 'codeFontSize') return `${value}px`

  return String(value)
}

function eventFromField(event: Event): boolean {
  const target = event.target

  if (!(target instanceof Element)) return false

  return target.closest('[data-field]') !== null
}

function normalizeHex(value: string): string {
  const trimmed = value.trim()

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase()

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    let expanded = '#'

    for (const char of trimmed.slice(1)) {
      expanded += `${char}${char}`
    }

    return expanded.toLowerCase()
  }

  const ctx = document.createElement('canvas').getContext('2d')

  if (!ctx) return '#000000'

  ctx.fillStyle = '#000000'

  ctx.fillStyle = trimmed

  const computed = ctx.fillStyle

  if (typeof computed === 'string' && /^#[0-9a-fA-F]{6}$/.test(computed)) return computed

  return '#000000'
}

export class ThemeTweakerController extends Controller<HTMLElement> {
  static targets = ['presetSelect', 'savedSelect', 'saveName', 'savedOption', 'field', 'readout']

  declare readonly presetSelectTarget: HTMLSelectElement

  declare readonly hasPresetSelectTarget: boolean

  declare readonly savedSelectTarget: HTMLSelectElement

  declare readonly hasSavedSelectTarget: boolean

  declare readonly saveNameTarget: HTMLInputElement

  declare readonly hasSaveNameTarget: boolean

  declare readonly savedOptionTarget: HTMLTemplateElement

  declare readonly hasSavedOptionTarget: boolean

  declare readonly fieldTargets: Array<HTMLInputElement | HTMLSelectElement>

  declare readonly readoutTargets: HTMLElement[]

  private draft: ThemeConfig = { ...DEFAULT_CONFIG }

  private syncingForm = false

  connect(): void {
    this.draft = getActive()

    this.populateForm(this.draft)

    this.refreshSavedOptions()

    applyConfig(this.draft)
  }

  input(event: Event): void {
    if (!eventFromField(event)) return

    this.liveApply()
  }

  change(event: Event): void {
    if (!eventFromField(event)) return

    this.liveApply()
  }

  preset(): void {
    if (!this.hasPresetSelectTarget) return

    const id = this.presetSelectTarget.value

    if (!id) return

    const preset = getPreset(id)

    if (!preset) return

    const next = { ...preset.config }

    this.populateForm(next)

    applyConfig(next)
  }

  apply(): void {
    this.draft = this.readForm()

    applyConfig(this.draft)

    this.syncPresetSelect(this.draft)
  }

  reset(): void {
    const next = resetToDefault()

    this.populateForm(next)

    applyConfig(next)
  }

  save(): void {
    if (!this.hasSaveNameTarget) return

    const name = this.saveNameTarget.value.trim()

    if (!name) {
      this.saveNameTarget.focus()

      return
    }

    this.draft = this.readForm()

    saveConfig(name, this.draft)

    applyConfig(this.draft)

    this.refreshSavedOptions(name)

    this.saveNameTarget.value = ''

    this.syncPresetSelect(this.draft)
  }

  load(): void {
    if (!this.hasSavedSelectTarget) return

    const name = this.savedSelectTarget.value

    if (!name) return

    const saved = listSaved()[name]

    if (!saved) return

    this.populateForm(saved)

    applyConfig(this.draft)
  }

  deleteSaved(): void {
    if (!this.hasSavedSelectTarget) return

    const name = this.savedSelectTarget.value

    if (!name) return

    deleteSavedConfig(name)

    this.refreshSavedOptions()
  }

  private populateForm(config: ThemeConfig): void {
    this.syncingForm = true

    this.draft = { ...DEFAULT_CONFIG, ...config }

    for (const el of this.fieldTargets) {
      const key = fieldKey(el)

      if (!key) continue

      this.writeControl(el, key, this.draft[key])
    }

    this.syncPresetSelect(this.draft)

    this.syncReadouts()

    this.syncingForm = false
  }

  private writeControl(el: HTMLInputElement | HTMLSelectElement, key: keyof ThemeConfig, value: string | number): void {
    if (el.type === 'color') {
      el.value = normalizeHex(String(value))

      return
    }

    if (key === 'shikiTheme' && el instanceof HTMLSelectElement) {
      this.writeShikiTheme(el, String(value))

      return
    }

    el.value = String(value)
  }

  private writeShikiTheme(el: HTMLSelectElement, id: string): void {
    for (const option of el.options) {
      if (option.value === id) {
        el.value = id

        return
      }
    }

    el.value = DEFAULT_CONFIG.shikiTheme
  }

  private readForm(): ThemeConfig {
    const next: ThemeConfig = { ...this.draft }

    for (const el of this.fieldTargets) {
      const key = fieldKey(el)

      if (!key) continue

      if (el.dataset.type === 'number') {
        writeThemeValue(next, key, Number(el.value))
      } else {
        writeThemeValue(next, key, el.value)
      }
    }

    if (next.accent !== this.draft.accent) {
      next.accentSoft = next.accent

      next.codePlaceholder = next.accent

      next.codeInlineFg = next.accent
    }

    if (next.border !== this.draft.border) {
      next.borderMuted = next.border
    }

    return next
  }

  private liveApply(): void {
    if (this.syncingForm) return

    this.draft = this.readForm()

    this.syncPresetSelect(this.draft)

    this.syncReadouts()

    applyConfig(this.draft)
  }

  private syncPresetSelect(config: ThemeConfig): void {
    if (!this.hasPresetSelectTarget) return

    this.presetSelectTarget.value = matchPresetId(config)
  }

  private syncReadouts(): void {
    for (const el of this.readoutTargets) {
      const key = el.dataset.readout

      if (!key) continue

      if (!isThemeKey(key)) continue

      el.textContent = readoutText(key, this.draft[key])
    }
  }

  private refreshSavedOptions(selected = ''): void {
    if (!this.hasSavedSelectTarget) return

    if (!this.hasSavedOptionTarget) return

    const saved = listSaved()

    const names = Object.keys(saved).sort((a, b) => a.localeCompare(b))

    const options: HTMLOptionElement[] = []

    const blank = this.cloneSavedOption('', '—')

    if (blank) options.push(blank)

    for (const name of names) {
      const option = this.cloneSavedOption(name, name)

      if (option) options.push(option)
    }

    this.savedSelectTarget.replaceChildren(...options)

    if (selected && names.includes(selected)) {
      this.savedSelectTarget.value = selected
    }
  }

  private cloneSavedOption(value: string, label: string): HTMLOptionElement | undefined {
    const fragment = this.savedOptionTarget.content.cloneNode(true)

    if (!(fragment instanceof DocumentFragment)) return

    const option = fragment.firstElementChild

    if (!(option instanceof HTMLOptionElement)) return

    option.value = value

    option.textContent = label

    return option
  }
}

export default ThemeTweakerController
