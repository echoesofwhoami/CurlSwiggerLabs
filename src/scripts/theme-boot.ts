import { apply, getActive } from './theme-config'

export function bootTheme(): void {
  apply(getActive())
}
