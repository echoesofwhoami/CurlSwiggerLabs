import type { ImageMetadata } from 'astro'
import type CurlIcon from '../assets/logos/curl.svg'

type SvgIcon = CurlIcon

export type ChipVisual =
  | { kind: 'svg'; Icon: SvgIcon; accent: string }
  | { kind: 'image'; src: ImageMetadata; accent: string }
