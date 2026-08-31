import type { ImageMetadata } from 'astro';
import CurlIcon from '../assets/logos/curl.svg';
import PythonIcon from '../assets/logos/python.svg';
import NodeIcon from '../assets/logos/nodedotjs.svg';
import ExpressIcon from '../assets/logos/express.svg';
import PhpIcon from '../assets/logos/php.svg';
import NginxIcon from '../assets/logos/nginx.svg';
import ChromiumIcon from '../assets/logos/chromium.svg';
import JavaScriptIcon from '../assets/logos/javascript.svg';
import psLogo from '../assets/ps_logo.png';

type SvgIcon = typeof CurlIcon;

export type ChipVisual =
  | { kind: 'svg'; Icon: SvgIcon; accent: string }
  | { kind: 'image'; src: ImageMetadata; accent: string };

const visuals: Record<string, ChipVisual> = {
  curl: { kind: 'svg', Icon: CurlIcon, accent: '#5EC8F0' },
  python: { kind: 'svg', Icon: PythonIcon, accent: '#FFD43B' },
  burp: { kind: 'image', src: psLogo, accent: '#FF6633' },
  node: { kind: 'svg', Icon: NodeIcon, accent: '#5FA04E' },
  express: { kind: 'svg', Icon: ExpressIcon, accent: '#E2E8F0' },
  php: { kind: 'svg', Icon: PhpIcon, accent: '#777BB4' },
  nginx: { kind: 'svg', Icon: NginxIcon, accent: '#009639' },
  chromium: { kind: 'svg', Icon: ChromiumIcon, accent: '#1A74E7' },
  javascript: { kind: 'svg', Icon: JavaScriptIcon, accent: '#F7DF1E' },
};

const aliases: Record<string, keyof typeof visuals> = {
  curl: 'curl',
  python: 'python',
  burp: 'burp',
  'burp suite': 'burp',
  'burp repeater': 'burp',
  burpsuite: 'burp',
  node: 'node',
  'node.js': 'node',
  nodejs: 'node',
  express: 'express',
  php: 'php',
  nginx: 'nginx',
  chromium: 'chromium',
  chrome: 'chromium',
  'google chrome': 'chromium',
  javascript: 'javascript',
  js: 'javascript',
  dompurify: 'javascript',
  'dom purify': 'javascript',
};

export function getChipVisual(label: string): ChipVisual | undefined {
  const id = aliases[label.trim().toLowerCase()];
  return id ? visuals[id] : undefined;
}
