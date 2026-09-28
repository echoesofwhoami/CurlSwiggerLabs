import type { LayoutProps } from '../types/layout'

export function layoutHead(props: LayoutProps, pageUrl: URL, site: URL | undefined) {
  const type = props.type ?? 'website'

  const imagePath = props.image ?? '/og-default.png'

  return {
    type,
    wide: props.wide ?? false,
    title: props.title ?? 'CurlSwiggerLabs',
    description: props.description ?? 'PortSwigger Web Security Academy labs solved with curl.',
    canonicalURL: new URL(pageUrl.pathname, site),
    pathname: pageUrl.pathname,
    ogImageURL: new URL(imagePath, site),
    ogImageType: imageContentType(imageExtension(imagePath)),
    ogImageWidth: '1200',
    ogImageHeight: ogHeight(imagePath),
    articleTime: articlePublishedTime(type, props.publishedTime),
  }
}

function imageExtension(imagePath: string): string | undefined {
  return imagePath.split('?')[0].split('.').pop()?.toLowerCase()
}

function imageContentType(ext: string | undefined): string {
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'

  if (ext === 'webp') return 'image/webp'

  if (ext === 'svg') return 'image/svg+xml'

  return 'image/png'
}

function ogHeight(imagePath: string): string {
  if (imagePath === '/og-default.png') return '627'

  return '675'
}

function articlePublishedTime(type: string, publishedTime: string | undefined): string {
  if (type === 'article' && publishedTime) return publishedTime

  return ''
}
