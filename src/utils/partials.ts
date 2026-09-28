import { getEntry } from 'astro:content'

type PartialCollection = 'partials' | 'lab-notes'

export async function requirePartial(id: string, collection: PartialCollection = 'partials') {
  const entry = await partialEntry(collection, id)

  if (!entry) throw new Error(`Partial not found: ${id} in ${collection}`)

  return entry
}

function partialEntry(collection: PartialCollection, id: string) {
  if (collection === 'lab-notes') return getEntry('lab-notes', id)

  return getEntry('partials', id)
}
