// Reusable data table component for rendering paginated entity lists.
import type { ReactNode } from 'react'

type Column<T> = {
  key: string
  title: string
  render: (item: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  emptyText?: string
  getRowKey?: (item: T) => string | number
}

export function DataTable<T>({
  columns,
  rows,
  emptyText = 'No data',
  getRowKey
}: DataTableProps<T>) {
  return (
    <table className='table'>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>{emptyText}</td>
          </tr>
        ) : (
          rows.map((item, index) => (
            <tr key={getRowKey ? getRowKey(item) : index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(item)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
