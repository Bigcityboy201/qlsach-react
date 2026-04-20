// App constants: route names, API paths, and reusable static values.
export const API_PATHS = {
  author: '/author',
  book: '/book',
  review: '/review'
}

export const PAGE_SIZE = 10

export const NAV_ITEMS = [
  { key: 'authors', label: 'Authors' },
  { key: 'books', label: 'Books' },
  { key: 'reviews', label: 'Reviews' }
] as const

export type NavKey = (typeof NAV_ITEMS)[number]['key']
