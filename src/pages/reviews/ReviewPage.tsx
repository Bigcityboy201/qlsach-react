// Review page: list, create, edit, and delete reviews.
import { useEffect, useState } from 'react'
import { bookApi } from '../../apis/book.api'
import { reviewApi } from '../../apis/review.api'
import { DataTable } from '../../components/common/DataTable'
import { usePagination } from '../../hooks/usePagination'
import type { Book, Review } from '../../types'

export default function ReviewPage() {
  const { page, pageSize, goNext, goPrev } = usePagination()
  const [items, setItems] = useState<Review[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Review | null>(null)
  const [content, setContent] = useState('')
  const [bookId, setBookId] = useState<number>(0)

  async function fetchBooks() {
    try {
      const paged = await bookApi.list(0, 200)
      setBooks(paged.items)
      if (!bookId && paged.items.length > 0) {
        setBookId(paged.items[0].id)
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function fetchReviews() {
    setLoading(true)
    setError('')
    try {
      const paged = await reviewApi.list(page, pageSize)
      setItems([...paged.items].sort((a, b) => a.id - b.id))
      setTotalPages(paged.totalPages)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchReviews()
  }, [page, pageSize])

  useEffect(() => {
    void fetchBooks()
  }, [])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      if (editing) {
        const updated = await reviewApi.update(editing.id, { content, bookId })
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === editing.id ? { ...item, ...updated } : item))
        )
      } else {
        await reviewApi.create({ content, bookId })
        await fetchReviews()
      }
      setContent('')
      setEditing(null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete review?')) {
      return
    }
    setError('')
    try {
      await reviewApi.remove(id)
      await fetchReviews()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section>
      <h1>Review Management</h1>
      <form className='form' onSubmit={onSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder='Review content'
          required
        />
        <select value={bookId} onChange={(event) => setBookId(Number(event.target.value))}>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
        <button type='submit'>{editing ? 'Update' : 'Create'}</button>
        {editing ? (
          <button
            type='button'
            onClick={() => {
              setEditing(null)
              setContent('')
            }}
          >
            Cancel
          </button>
        ) : null}
      </form>
      {error ? <p className='error'>{error}</p> : null}
      {loading ? <p>Loading...</p> : null}
      <DataTable
        columns={[
          { key: 'id', title: 'ID', render: (item) => item.id },
          { key: 'content', title: 'Content', render: (item) => item.content },
          { key: 'bookTitle', title: 'Book', render: (item) => item.bookTitle ?? '-' },
          { key: 'authorName', title: 'Author', render: (item) => item.authorName ?? '-' },
          {
            key: 'actions',
            title: 'Actions',
            render: (item) => (
              <div className='actions'>
                <button
                  type='button'
                  onClick={() => {
                    setEditing(item)
                    setContent(item.content)
                  }}
                >
                  Edit
                </button>
                <button type='button' onClick={() => void onDelete(item.id)}>
                  Delete
                </button>
              </div>
            )
          }
        ]}
        rows={items}
        getRowKey={(row) => row.id}
      />
      <div className='pagination'>
        <button type='button' onClick={goPrev}>
          Prev
        </button>
        <span>
          Page {page + 1} / {Math.max(totalPages, 1)}
        </span>
        <button type='button' onClick={() => goNext(totalPages)}>
          Next
        </button>
      </div>
    </section>
  )
}
