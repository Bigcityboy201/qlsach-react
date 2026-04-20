// Author page: list, create, edit, and delete authors.
import { useEffect, useState } from 'react'
import { authorApi } from '../../apis/author.api'
import { DataTable } from '../../components/common/DataTable'
import { usePagination } from '../../hooks/usePagination'
import type { Author } from '../../types'

export default function AuthorPage() {
  const { page, pageSize, goNext, goPrev } = usePagination()
  const [items, setItems] = useState<Author[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Author | null>(null)
  const [name, setName] = useState('')

  async function fetchAuthors() {
    setLoading(true)
    setError('')
    try {
      const paged = await authorApi.list(page, pageSize)
      setItems(paged.items)
      setTotalPages(paged.totalPages)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchAuthors()
  }, [page, pageSize])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    try {
      if (editing) {
        await authorApi.update(editing.id, { name })
      } else {
        await authorApi.create({ name })
      }
      setName('')
      setEditing(null)
      await fetchAuthors()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete author?')) {
      return
    }
    setError('')
    try {
      await authorApi.remove(id)
      await fetchAuthors()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section>
      <h1>Author Management</h1>
      <form className='form' onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder='Author name'
          required
        />
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
          { key: 'totalBook', title: 'Total Books', render: (item) => item.totalBook ?? 0 },
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
