export const categories = {
  jwt: {
    labels: {
      en: 'JWT',
      es: 'JWT',
    },
    coverImage: '/images/categories/jwt.svg?v=3',
    ogImage: '/images/categories/jwt.png',
  },
  oauth: {
    labels: {
      en: 'OAuth',
      es: 'OAuth',
    },
    coverImage: '/images/categories/oauth.svg?v=3',
    ogImage: '/images/categories/oauth.png',
  },
  ssrf: {
    labels: {
      en: 'SSRF',
      es: 'SSRF',
    },
    coverImage: '/images/categories/ssrf.svg?v=3',
    ogImage: '/images/categories/ssrf.png',
  },
  'http-request-smuggling': {
    labels: {
      en: 'HTTP Request Smuggling',
      es: 'HTTP Request Smuggling',
    },
    coverImage: '/images/categories/http-request-smuggling.svg?v=3',
    ogImage: '/images/categories/http-request-smuggling.png',
  },
  'php-object-injection': {
    labels: {
      en: 'Object Injection (PHP)',
      es: 'Inyección de Objetos (PHP)',
    },
    coverImage: '/images/categories/php-object-injection.svg?v=3',
    ogImage: '/images/categories/php-object-injection.png',
  },
  'prototype-pollution': {
    labels: {
      en: 'Prototype Pollution',
      es: 'Prototype Pollution',
    },
    coverImage: '/images/categories/prototype-pollution.svg?v=1',
    ogImage: '/images/categories/prototype-pollution.png',
  },
} as const;

export type CategoryId = keyof typeof categories;
export type SupportedLanguage = 'en' | 'es';

export function getCategoryId(label: string): CategoryId | undefined {
  return (Object.entries(categories) as [CategoryId, (typeof categories)[CategoryId]][])
    .find(([, category]) => Object.values(category.labels).some((value) => value === label))
    ?.[0];
}

export function getCategory(id: CategoryId, lang: SupportedLanguage) {
  const category = categories[id];

  return {
    id,
    label: category.labels[lang],
    coverImage: category.coverImage,
    ogImage: category.ogImage,
  };
}
