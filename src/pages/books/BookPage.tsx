// Book page: list, create, edit, and delete books.
import { useEffect, useState } from 'react'
import { authorApi } from '../../apis/author.api'
import { bookApi } from '../../apis/book.api'
import { DataTable } from '../../components/common/DataTable'
import { usePagination } from '../../hooks/usePagination'
import type { Author, Book } from '../../types'

export default function BookPage() {
  const { page, pageSize, goNext, goPrev } = usePagination()
  const [items, setItems] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Book | null>(null)
  const [name, setName] = useState('')
  const [authorId, setAuthorId] = useState<number>(0)

  async function fetchAuthors() {
    try {
      const paged = await authorApi.list(0, 200)
      setAuthors(paged.items)
      if (!authorId && paged.items.length > 0) {
        setAuthorId(paged.items[0].id)
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function fetchBooks() {
    setLoading(true)
    setError('')
    try {
      const paged = await bookApi.list(page, pageSize)
      setItems([...paged.items].sort((a, b) => a.id - b.id))
      setTotalPages(paged.totalPages)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchBooks()
  }, [page, pageSize])

  useEffect(() => {
    void fetchAuthors()
  }, [])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      if (editing) {
        const updated = await bookApi.update(editing.id, { name, authorId })
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === editing.id ? { ...item, ...updated } : item))
        )
      } else {
        await bookApi.create({ name, authorId })
        await fetchBooks()
      }
      setName('')
      setEditing(null)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete book?')) {
      return
    }
    setError('')
    try {
      await bookApi.remove(id)
      await fetchBooks()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section>
      <h1>Book Management</h1>
      <form className='form' onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder='Book name'
          required
        />
        <select value={authorId} onChange={(event) => setAuthorId(Number(event.target.value))}>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <button type='submit'>{editing ? 'Update' : 'Create'}</button>
        {editing ? (
          <button
            type='button'
            onClick={() => {
              setEditing(null)
              setName('')
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
          { key: 'name', title: 'Name', render: (item) => item.name },
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
                    setName(item.name)
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
