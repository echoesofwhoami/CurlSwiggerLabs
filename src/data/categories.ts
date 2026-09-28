export const categories = {
  jwt: {
    label: 'JWT',
    coverImage: '/images/categories/jwt.svg?v=3',
    ogImage: '/images/categories/jwt.png',
  },
  oauth: {
    label: 'OAuth',
    coverImage: '/images/categories/oauth.svg?v=3',
    ogImage: '/images/categories/oauth.png',
  },
  ssrf: {
    label: 'SSRF',
    coverImage: '/images/categories/ssrf.svg?v=3',
    ogImage: '/images/categories/ssrf.png',
  },
  'http-request-smuggling': {
    label: 'HTTP Request Smuggling',
    coverImage: '/images/categories/http-request-smuggling.svg?v=3',
    ogImage: '/images/categories/http-request-smuggling.png',
  },
  'php-object-injection': {
    label: 'Object Injection (PHP)',
    coverImage: '/images/categories/php-object-injection.svg?v=3',
    ogImage: '/images/categories/php-object-injection.png',
  },
  'prototype-pollution': {
    label: 'Prototype Pollution',
    coverImage: '/images/categories/prototype-pollution.svg?v=1',
    ogImage: '/images/categories/prototype-pollution.png',
  },
  'dom-based': {
    label: 'DOM-based',
    coverImage: '/images/categories/dom-based.svg?v=1',
    ogImage: '/images/categories/dom-based.png',
  },
} as const

export type CategoryId = keyof typeof categories

export function getCategoryId(label: string): CategoryId | undefined {
  return (Object.entries(categories) as [CategoryId, (typeof categories)[CategoryId]][])
    .find(([, category]) => category.label === label)
    ?.[0]
}
export function getCategory(id: CategoryId) {
  const category = categories[id]

  return {
    id,
    label: category.label,
    coverImage: category.coverImage,
    ogImage: category.ogImage,
  }
}
export function categoryForLabel(label: string) {
  const categoryId = getCategoryId(label)
  return categoryId ? getCategory(categoryId) : undefined
}
