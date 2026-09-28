import type { ImageMetadata } from 'astro'
import type CurlIcon from '@assets/logos/curl.svg'

type SvgIcon = typeof CurlIcon

export type ChipSvg = SvgIcon

export type ChipVisual =
  | { kind: 'svg'; Icon: SvgIcon; accent: string }
  | { kind: 'image'; src: ImageMetadata; accent: string }

export interface ChipView {
  accent: string;
  svg: ChipSvg | undefined;
  photo: ImageMetadata | undefined;
}
