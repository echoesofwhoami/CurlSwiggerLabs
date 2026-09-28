import { getCollection } from 'astro:content'
import { categoryForLabel } from '@data/categories'
import { siteConfig } from '../site.config'
import type { FooterLink, NavbarModel } from '../types/layout'
import type {
  BlogPost,
  ConceptGroup,
  ConceptPartial,
  DescriptionParagraph,
  GroupedPosts,
  Heading,
  LabLink,
  PostHeaderProps,
} from '../types/post'

export function getPostSlug(id: string): string {
  return id.replace(/\.mdx?$/, '')
}

function labLink(post: BlogPost | undefined): LabLink | undefined {
  if (!post) return

  return {
    href: `${siteBase()}/${getPostSlug(post.id)}`,
    title: post.data.title,
  }
}

export function postNavLinks(older: BlogPost | undefined, newer: BlogPost | undefined) {
  return {
    olderLink: labLink(older),
    newerLink: labLink(newer),
  }
}

export function slugifyId(value: string): string {
  const lowered = value.toLowerCase()

  const dashed = lowered.replace(/[^a-z0-9]+/g, '-')

  return dashed.replace(/^-+|-+$/g, '')
}

export function siteBase(): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '')
}

export function sitePath(page: string): string {
  const base = siteBase()

  if (page.length === 0) {
    if (base.length === 0) return '/'

    return base
  }

  return `${base}/${page}`
}

export function currentNavSlug(currentPath: string, base: string): string {
  let path = currentPath

  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/'
  }

  const parts: string[] = []

  for (const part of path.split('/')) {
    if (part.length === 0) continue

    parts.push(part)
  }

  return parts.join('/')
}

export function ariaCurrent(currentSlug: string, pageSlug: string): 'page' | undefined {
  if (currentSlug === pageSlug) return 'page'

  return
}

export function navbarModel(currentPath: string, wide?: boolean): NavbarModel {
  const base = siteBase()

  return {
    wide: wide ?? false,
    homePath: sitePath(''),
    aboutPath: sitePath('about'),
    conceptsPath: sitePath('background-concepts'),
    tweakerPath: sitePath('i-dont-like-this-website'),
    currentSlug: currentNavSlug(currentPath, base),
    menuId: 'site-nav-menu',
  }
}

function byNewestFirst(a: BlogPost, b: BlogPost) {
  const dateDifference = new Date(b.data.date).getTime() - new Date(a.data.date).getTime()

  return dateDifference || a.id.localeCompare(b.id)
}

export async function getPosts() {
  const posts = await getCollection('blog')

  return posts.map((post) => ({
    params: { slug: getPostSlug(post.id) },
    props: { post },
  }))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function postCardView(post: BlogPost) {
  return {
    href: `${siteBase()}/${getPostSlug(post.id)}`,
    coverImage: categoryForLabel(post.data.category)?.coverImage,
  }
}

export async function getGroupedPosts() {
  const posts = await loadBlogPosts()

  const sortedPosts = sortNewestFirst(posts)

  return groupPostsByCategory(sortedPosts)
}

async function loadBlogPosts() {
  return getCollection('blog')
}

function sortNewestFirst(posts: BlogPost[]): BlogPost[] {
  return posts.sort(byNewestFirst)
}

function groupPostsByCategory(posts: BlogPost[]): GroupedPosts[] {
  const postsByCategory = collectPostsByCategory(posts)

  return listPostGroups(postsByCategory)
}

function collectPostsByCategory(posts: BlogPost[]): Map<string, BlogPost[]> {
  const postsByCategory = new Map<string, BlogPost[]>()

  for (const post of posts) {
    const category = post.data.category

    const existing = postsByCategory.get(category)

    if (existing) {
      existing.push(post)

      continue
    }

    postsByCategory.set(category, [post])
  }

  return postsByCategory
}

function listPostGroups(postsByCategory: Map<string, BlogPost[]>): GroupedPosts[] {
  const groups: GroupedPosts[] = []

  for (const [category, categoryPosts] of postsByCategory) {
    groups.push({ category, categoryPosts })
  }

  return groups
}

export async function getConceptGroups() {
  const partials = await loadConceptPartials()

  const sortedPartials = sortPartialsByTitle(partials)

  return groupPartialsByCategory(sortedPartials)
}

async function loadConceptPartials() {
  return getCollection('partials')
}

function sortPartialsByTitle(partials: ConceptPartial[]): ConceptPartial[] {
  return partials.sort(byPartialTitle)
}

function byPartialTitle(a: ConceptPartial, b: ConceptPartial): number {
  return a.data.title.localeCompare(b.data.title)
}

function groupPartialsByCategory(partials: ConceptPartial[]): ConceptGroup[] {
  const categories = uniqueCategories(partials)

  categories.sort(byCategoryName)

  return categories.map((category) => toConceptGroup(category, partials))
}

function uniqueCategories(partials: ConceptPartial[]): string[] {
  const seen = new Set<string>()

  const categories: string[] = []

  for (const entry of partials) {
    const category = entry.data.category

    if (seen.has(category)) continue

    seen.add(category)

    categories.push(category)
  }

  return categories
}

function byCategoryName(a: string, b: string): number {
  return a.localeCompare(b)
}

function toConceptGroup(category: string, partials: ConceptPartial[]): ConceptGroup {
  const inCategory: ConceptPartial[] = []

  for (const entry of partials) {
    if (entry.data.category !== category) continue

    inCategory.push(entry)
  }

  return {
    category,
    id: slugifyId(category),
    partials: inCategory,
  }
}

export function footerLinks() {
  const base = siteBase()

  const homeHref = base || '/'

  const explore = exploreLinks(base, homeHref)

  const resources = presentLinks(resourceLinks(base))

  const social = presentLinks(socialLinks())

  return {
    homeHref,
    explore,
    resources,
    social,
    discordInvite: trimmedDiscordInvite(),
    discordHandle: siteConfig.discordHandle,
    year: new Date().getFullYear(),
  }
}

export function discordCta(compact?: boolean) {
  return {
    compact: compact ?? false,
    inviteUrl: trimmedDiscordInvite(),
    body: `Bring questions, confusing HTTP, or requests for the next writeup. Find me on Discord as ${siteConfig.discordHandle}.`,
  }
}

function trimmedDiscordInvite(): string {
  return siteConfig.discordInviteUrl.trim()
}

function exploreLinks(base: string, homeHref: string): FooterLink[] {
  return [
    footerLink('Home', homeHref, false),
    footerLink('About', `${base}/about`, false),
    footerLink('Background Concepts', `${base}/background-concepts`, false),
    footerLink('I don\'t like this website', `${base}/i-dont-like-this-website`, false),
  ]
}

function resourceLinks(base: string): FooterLink[] {
  return [
    footerLink('RSS', `${base}${siteConfig.rssPath}`, false),
    footerLink('Blog source', siteConfig.blogSourceUrl.trim(), true),
  ]
}

function socialLinks(): FooterLink[] {
  return [
    footerLink('GitHub', siteConfig.githubProfileUrl.trim(), true),
    footerLink('LinkedIn', siteConfig.linkedinUrl.trim(), true),
  ]
}

function presentLinks(links: FooterLink[]): FooterLink[] {
  const present: FooterLink[] = []

  for (const link of links) {
    if (link.href.length === 0) continue

    present.push(link)
  }

  return present
}

function footerLink(label: string, href: string, external: boolean): FooterLink {
  if (external) {
    return { label, href, external, target: '_blank', rel: 'noreferrer' }
  }

  return { label, href, external, target: undefined, rel: undefined }
}

export async function getAdjacentPosts(slug: string) {
  const posts = await getCollection('blog')

  const currentPost = posts.find((post) => getPostSlug(post.id) === slug)

  if (!currentPost) {
    return { older: undefined, newer: undefined }
  }

  const categoryPosts = posts
    .filter((post) => post.data.category === currentPost.data.category)
    .sort((a, b) => {
      const dateDifference = new Date(a.data.date).getTime() - new Date(b.data.date).getTime()

      return dateDifference || a.id.localeCompare(b.id)
    })

  const currentIndex = categoryPosts.findIndex((post) => post.id === currentPost.id)

  return {
    older: categoryPosts[currentIndex - 1],
    newer: categoryPosts[currentIndex + 1],
  }
}

export async function getRelatedPosts(slug: string, limit = 3) {
  if (limit <= 0) {
    return []
  }

  const posts = await getCollection('blog')

  const currentPost = posts.find((post) => getPostSlug(post.id) === slug)

  if (!currentPost) {
    return []
  }

  const candidates = posts
    .filter((post) => post.id !== currentPost.id)
    .sort(byNewestFirst)

  let sameSeries: BlogPost[] = []

  if (currentPost.data.series) {
    sameSeries = candidates.filter((post) => post.data.series === currentPost.data.series)
  }

  const sameCategory = candidates.filter(
    (post) =>
      post.data.category === currentPost.data.category &&
      !sameSeries.some((seriesPost) => seriesPost.id === post.id),
  )

  return [...sameSeries, ...sameCategory].slice(0, limit)
}

export async function postPage(post: BlogPost) {
  const slug = getPostSlug(post.id)

  const category = categoryForLabel(post.data.category)

  const [adjacent, relatedPosts] = await Promise.all([
    getAdjacentPosts(slug),
    getRelatedPosts(slug),
  ])

  return {
    slug,
    category,
    older: adjacent.older,
    newer: adjacent.newer,
    relatedPosts,
  }
}

export function postHeaderView(header: PostHeaderProps) {
  return {
    technologies: header.technologies ?? [],
    seriesName: header.series?.replaceAll('-', ' '),
    paragraphs: descriptionParagraphs(header.description),
    difficultyClass: `difficulty-chip--${header.difficulty.toLowerCase()}`,
  }
}

export function headingsOnPage(headings: Heading[]): Heading[] {
  const visible: Heading[] = []

  for (const heading of headings) {
    if (heading.depth !== 2 && heading.depth !== 3) continue

    visible.push(heading)
  }

  return visible
}

export function descriptionParagraphs(description: string): DescriptionParagraph[] {
  const lines: string[] = []

  for (const raw of description.split(/\n+/)) {
    const line = raw.trim()

    if (line.length === 0) continue

    lines.push(line)
  }

  const paragraphs: DescriptionParagraph[] = []

  const lastIndex = lines.length - 1

  for (let index = 0; index < lines.length; index++) {
    const text = lines[index]

    if (!text) continue

    const hook = lines.length > 1 && index === lastIndex

    paragraphs.push({ text, hook })
  }

  return paragraphs
}
