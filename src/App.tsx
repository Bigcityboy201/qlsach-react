// Root app component: renders route tree and shared app-level wrappers.
import MainLayout from './layouts/MainLayout'
import AuthorPage from './pages/authors/AuthorPage'
import BookPage from './pages/books/BookPage'
import ReviewPage from './pages/reviews/ReviewPage'
import { useAppContext } from './contexts/AppContext'

export default function App() {
  const { activeNav, setActiveNav } = useAppContext()

  return (
    <MainLayout activeNav={activeNav} onChangeNav={setActiveNav}>
      {activeNav === 'authors' ? <AuthorPage /> : null}
      {activeNav === 'books' ? <BookPage /> : null}
      {activeNav === 'reviews' ? <ReviewPage /> : null}
    </MainLayout>
  )
}
