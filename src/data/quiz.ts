import { getEntry } from 'astro:content'
import type { QuizView } from '../types/quiz'

export async function loadQuiz(file: string): Promise<QuizView> {
  const entry = await getEntry('quizzes', file)

  if (!entry || entry.data.questions.length === 0) {
    return { count: 0, questions: '[]' }
  }

  return {
    count: entry.data.questions.length,
    questions: JSON.stringify(entry.data.questions),
  }
}
