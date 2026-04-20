// Main app layout: shared header/sidebar/content frame for all pages.
import type { ReactNode } from 'react'
import type { NavKey } from '../constants'
import { routes } from '../routes'

type MainLayoutProps = {
  activeNav: NavKey
  onChangeNav: (key: NavKey) => void
  children: ReactNode
}

export default function MainLayout({ activeNav, onChangeNav, children }: MainLayoutProps) {
  return (
    <div className='layout'>
      <aside className='sidebar'>
        <h2>Book Admin</h2>
        <nav>
          {routes.map((route) => (
            <button
              key={route.key}
              className={route.key === activeNav ? 'nav-item active' : 'nav-item'}
              onClick={() => onChangeNav(route.key)}
              type='button'
            >
              {route.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className='content'>{children}</main>
    </div>
  )
}
