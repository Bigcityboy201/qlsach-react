// Application routing: maps nav keys to page titles.
import { NAV_ITEMS, type NavKey } from '../constants'

export type RouteItem = {
  key: NavKey
  label: string
}

export const routes: RouteItem[] = [...NAV_ITEMS]
