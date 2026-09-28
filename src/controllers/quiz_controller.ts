import { Controller } from '@hotwired/stimulus'
import type { QuizQuestion, SavedScore } from '@types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const field = record[key]

  if (typeof field !== 'string') return

  return field
}

function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const field = record[key]

  if (typeof field !== 'number') return

  return field
}

function readStrings(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return

  const items: string[] = []

  for (const item of value) {
    if (typeof item !== 'string') return

    items.push(item)
  }

  return items
}

function questionFrom(value: unknown): QuizQuestion | undefined {
  if (!isRecord(value)) return

  const q = readString(value, 'q')

  const o = readStrings(value.o)

  const a = readNumber(value, 'a')

  if (!q || !o || a === undefined) return

  const question: QuizQuestion = { q, o, a }

  const explanation = readString(value, 'x')

  if (explanation) question.x = explanation

  const hint = readString(value, 'h')

  if (hint) question.h = hint

  return question
}

function savedScore(value: unknown): SavedScore | undefined {
  if (!isRecord(value)) return

  const score = readNumber(value, 'score')

  const total = readNumber(value, 'total')

  if ([score, total].some((item) => !item)) return

  return { score, total } as SavedScore
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))

    const current = copy[index]

    const swap = copy[swapIndex]

    if (current === undefined || swap === undefined) continue

    copy[index] = swap

    copy[swapIndex] = current
  }

  return copy
}

function shuffledIndexes(length: number): number[] {
  const order: number[] = []

  for (let index = 0; index < length; index++) order.push(index)

  return shuffled(order)
}

function letterFor(index: number): string {
  return String.fromCharCode(65 + index)
}

function percent(part: number, total: number): number {
  if (total === 0) return 0

  return Math.round((part / total) * 100)
}

function elementPart(root: ParentNode, name: string): HTMLElement | undefined {
  const node = root.querySelector(`[data-quiz-part="${name}"]`)

  if (!(node instanceof HTMLElement)) return

  return node
}

function setPartText(root: ParentNode, name: string, text: string): void {
  const node = elementPart(root, name)

  if (!node) return

  node.textContent = text
}

function cloneContent(template: HTMLTemplateElement): DocumentFragment | undefined {
  const clone = template.content.cloneNode(true)

  if (clone instanceof DocumentFragment) return clone

  return
}

function optionIndex(button: HTMLButtonElement): number | undefined {
  const raw = button.dataset.idx

  if (!raw) return

  const chosen = Number(raw)

  if (!Number.isInteger(chosen)) return

  return chosen
}

export class QuizController extends Controller {
  static targets = ['stage', 'question', 'option', 'hint', 'summary']

  static values = {
    questions: Array,
    slug: { type: String, default: 'quiz' },
    questionLabel: { type: String, default: 'Question' },
    ofLabel: { type: String, default: 'of' },
    correctLabel: { type: String, default: 'Correct!' },
    wrongLabel: { type: String, default: 'Not quite' },
    nextLabel: { type: String, default: 'Next question' },
    resultsLabel: { type: String, default: 'See results' },
    retakeLabel: { type: String, default: 'Retake quiz' },
    scoredLabel: { type: String, default: 'You scored' },
    correctCountLabel: { type: String, default: 'correct' },
    hintLabel: { type: String, default: 'Get a hint' },
  }

  declare readonly stageTarget: HTMLElement

  declare readonly hasStageTarget: boolean

  declare readonly questionTarget: HTMLTemplateElement

  declare readonly hasQuestionTarget: boolean

  declare readonly optionTarget: HTMLTemplateElement

  declare readonly hasOptionTarget: boolean

  declare readonly hintTarget: HTMLTemplateElement

  declare readonly hasHintTarget: boolean

  declare readonly summaryTarget: HTMLTemplateElement

  declare readonly hasSummaryTarget: boolean

  declare questionsValue: unknown[]

  declare slugValue: string

  declare questionLabelValue: string

  declare ofLabelValue: string

  declare correctLabelValue: string

  declare wrongLabelValue: string

  declare nextLabelValue: string

  declare resultsLabelValue: string

  declare retakeLabelValue: string

  declare scoredLabelValue: string

  declare correctCountLabelValue: string

  declare hintLabelValue: string

  private bank: QuizQuestion[] = []

  private round: QuizQuestion[] = []

  private score = 0

  private index = 0

  private correctAt = 0

  private answered = false

  private current: QuizQuestion | undefined

  connect(): void {
    if (!this.hasStageTarget) return

    if (!this.hasQuestionTarget) return

    if (!this.hasOptionTarget) return

    if (!this.hasSummaryTarget) return

    this.bank = this.loadBank()

    if (this.bank.length === 0) return

    const saved = this.readSaved()

    if (saved) {
      this.showSummary(saved.score, saved.total)

      return
    }

    this.round = shuffled(this.bank)

    this.score = 0

    this.showQuestion(0)
  }

  choose(event: Event): void {
    if (this.answered) return

    const button = event.currentTarget

    if (!(button instanceof HTMLButtonElement)) return

    const question = this.current

    if (!question) return

    if (!this.hasStageTarget) return

    const chosen = optionIndex(button)

    if (chosen === undefined) return

    this.answered = true

    const correct = chosen === this.correctAt

    if (correct) this.score += 1

    this.markOptions(this.stageTarget, button, correct)

    this.hideHint(this.stageTarget)

    this.showFeedback(this.stageTarget, question, correct)
  }

  revealHint(event: Event): void {
    const button = event.currentTarget

    if (!(button instanceof HTMLButtonElement)) return

    const area = button.closest('.quiz-hint-area')

    if (!(area instanceof HTMLElement)) return

    const text = area.querySelector('.quiz-hint-text')

    if (!(text instanceof HTMLElement)) return

    text.hidden = false

    button.hidden = true
  }

  advance(): void {
    if (!this.answered) return

    const total = this.round.length

    const last = this.index >= total - 1

    if (last) {
      this.persist(this.score, total)

      this.showSummary(this.score, total)

      return
    }

    this.showQuestion(this.index + 1)
  }

  retake(): void {
    this.round = shuffled(this.bank)

    this.score = 0

    this.answered = false

    this.current = undefined

    try {
      localStorage.removeItem(this.storageKey())
    } catch {
      // storage unavailable
    }

    this.showQuestion(0)
  }

  private loadBank(): QuizQuestion[] {
    const bank: QuizQuestion[] = []

    let raw: unknown

    try {
      raw = this.questionsValue
    } catch {
      return bank
    }

    if (!Array.isArray(raw)) return bank

    for (const item of raw) {
      const question = questionFrom(item)

      if (!question) continue

      bank.push(question)
    }

    return bank
  }

  private storageKey(): string {
    return `csl-quiz-${this.slugValue}`
  }

  private readSaved(): SavedScore | undefined {
    try {
      const raw = localStorage.getItem(this.storageKey())

      if (!raw) return

      return savedScore(JSON.parse(raw))
    } catch {
      return
    }
  }

  private persist(score: number, total: number): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify({ score, total }))
    } catch {
      // storage unavailable
    }
  }

  private showQuestion(index: number): void {
    const question = this.round[index]

    if (!question) return

    if (!this.hasStageTarget) return

    if (!this.hasQuestionTarget) return

    if (!this.hasOptionTarget) return

    const view = cloneContent(this.questionTarget)

    if (!view) return

    const optionOrder = shuffledIndexes(question.o.length)

    this.fillQuestion(view, question, index, optionOrder)

    this.index = index

    this.current = question

    this.correctAt = optionOrder.indexOf(question.a)

    this.answered = false

    this.stageTarget.replaceChildren(view)
  }

  private fillQuestion(
    view: DocumentFragment,
    question: QuizQuestion,
    index: number,
    optionOrder: number[],
  ): void {
    const total = this.round.length

    const current = index + 1

    setPartText(view, 'label', this.questionLabelValue)

    setPartText(view, 'current', String(current))

    setPartText(view, 'of', this.ofLabelValue)

    setPartText(view, 'total', String(total))

    setPartText(view, 'number', `${current}.`)

    setPartText(view, 'prompt', question.q)

    this.setProgress(view, index, total)

    this.setNextLabel(view, index, total)

    this.appendOptions(view, question, optionOrder)

    this.appendHint(view, question.h)
  }

  private setProgress(view: ParentNode, index: number, total: number): void {
    const track = view.querySelector('.quiz-progress-track')

    const fill = view.querySelector('.quiz-progress-fill')

    const current = String(index + 1)

    const ofTotal = String(total)

    if (track instanceof HTMLElement) {
      track.setAttribute('aria-valuenow', current)

      track.setAttribute('aria-valuemax', ofTotal)

      track.setAttribute(
        'aria-label',
        `${this.questionLabelValue} ${current} ${this.ofLabelValue} ${ofTotal}`,
      )
    }

    if (fill instanceof HTMLElement) fill.style.width = `${percent(index, total)}%`
  }

  private setNextLabel(view: ParentNode, index: number, total: number): void {
    const next = elementPart(view, 'next')

    if (!next) return

    if (index >= total - 1) {
      next.textContent = this.resultsLabelValue

      return
    }

    next.textContent = this.nextLabelValue
  }

  private appendOptions(view: ParentNode, question: QuizQuestion, optionOrder: number[]): void {
    if (!this.hasOptionTarget) return

    const list = elementPart(view, 'options')

    if (!list) return

    for (let displayIndex = 0; displayIndex < optionOrder.length; displayIndex++) {
      const sourceIndex = optionOrder[displayIndex]

      if (sourceIndex === undefined) continue

      const label = question.o[sourceIndex]

      if (!label) continue

      const option = cloneContent(this.optionTarget)

      if (!option) continue

      setPartText(option, 'letter', letterFor(displayIndex))

      setPartText(option, 'text', label)

      const button = option.querySelector('.quiz-opt')

      if (button instanceof HTMLButtonElement) button.dataset.idx = String(displayIndex)

      list.append(option)
    }
  }

  private appendHint(view: ParentNode, hint: string | undefined): void {
    if (!hint) return

    if (!this.hasHintTarget) return

    const body = elementPart(view, 'body')

    if (!body) return

    const hintView = cloneContent(this.hintTarget)

    if (!hintView) return

    setPartText(hintView, 'hint-label', this.hintLabelValue)

    setPartText(hintView, 'hint-text', hint)

    body.append(hintView)
  }

  private showSummary(score: number, total: number): void {
    if (!this.hasStageTarget) return

    if (!this.hasSummaryTarget) return

    const view = cloneContent(this.summaryTarget)

    if (!view) return

    const root = view.querySelector('.quiz-summary')

    if (root instanceof HTMLElement && score === total) root.classList.add('is-perfect')

    setPartText(view, 'score', String(score))

    setPartText(view, 'total', String(total))

    setPartText(view, 'scored', this.scoredLabelValue)

    setPartText(view, 'fraction', `${score} ${this.ofLabelValue} ${total}`)

    setPartText(view, 'correct', this.correctCountLabelValue)

    const bar = view.querySelector('.quiz-score-bar')

    if (bar instanceof HTMLElement) bar.style.width = `${percent(score, total)}%`

    const retake = view.querySelector('.quiz-retake')

    if (retake) retake.textContent = this.retakeLabelValue

    this.stageTarget.replaceChildren(view)
  }

  private markOptions(stage: HTMLElement, chosen: HTMLButtonElement, correct: boolean): void {
    const buttons = stage.querySelectorAll('.quiz-opt')

    for (const node of buttons) {
      if (!(node instanceof HTMLButtonElement)) continue

      node.disabled = true

      if (Number(node.dataset.idx) === this.correctAt) node.classList.add('is-correct')
    }

    if (!correct) chosen.classList.add('is-wrong')
  }

  private hideHint(stage: HTMLElement): void {
    const area = stage.querySelector('.quiz-hint-area')

    if (!(area instanceof HTMLElement)) return

    area.hidden = true
  }

  private showFeedback(stage: HTMLElement, question: QuizQuestion, correct: boolean): void {
    const feedback = stage.querySelector('.quiz-feedback')

    const label = stage.querySelector('.quiz-fb-label')

    const body = stage.querySelector('.quiz-fb-text')

    if (!(feedback instanceof HTMLElement)) return

    if (!(label instanceof HTMLElement)) return

    if (!(body instanceof HTMLElement)) return

    feedback.classList.remove('is-correct', 'is-wrong')

    if (correct) {
      feedback.classList.add('is-correct')

      label.textContent = this.correctLabelValue

      body.textContent = question.x ?? ''
    } else {
      feedback.classList.add('is-wrong')

      label.textContent = this.wrongLabelValue

      body.textContent = question.h ?? question.x ?? ''
    }

    feedback.hidden = false

    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

export default QuizController
