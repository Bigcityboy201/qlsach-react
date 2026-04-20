// Shared TypeScript models and API response interfaces used across app.
export interface ApiSuccess<T> {
  operationType: string
  message: string
  code: string
  data: T
  size: number
  totalElements?: number
  totalPages?: number
  page?: number
  pageSize?: number
}

export interface ApiError {
  message?: string
  details?: Record<string, string>
}

export interface Author {
  id: number
  name: string
  createAt?: string
  updateAt?: string
  totalBook?: number
}

export interface Book {
  id: number
  name: string
  createAt?: string
  updateAt?: string
  authorName?: string
}

export interface Review {
  id: number
  content: string
  createAt?: string
  updateAt?: string
  bookTitle?: string
  authorName?: string
}

export interface AuthorRequest {
  name: string
}

export interface BookRequest {
  name: string
  authorId: number
}

export interface ReviewRequest {
  content: string
  bookId: number
}

export interface PagedData<T> {
  items: T[]
  totalElements: number
  totalPages: number
  page: number
  pageSize: number
}
