// Book API layer: functions for CRUD requests to /book endpoints.
import axiosClient from './axiosClient'
import { API_PATHS } from '../constants'
import type { ApiMutationResult, ApiSuccess, Book, BookRequest, PagedData } from '../types'

function toPagedData(response: ApiSuccess<Book[]>): PagedData<Book> {
  return {
    items: response.data ?? [],
    totalElements: response.totalElements ?? 0,
    totalPages: response.totalPages ?? 0,
    page: response.page ?? 0,
    pageSize: response.pageSize ?? 10
  }
}

export const bookApi = {
  async list(page: number, size: number): Promise<PagedData<Book>> {
    const { data } = await axiosClient.get<ApiSuccess<Book[]>>(API_PATHS.book, {
      params: { page, size }
    })
    return toPagedData(data)
  },

  async create(payload: BookRequest): Promise<ApiMutationResult<Book>> {
    const { data } = await axiosClient.post<ApiSuccess<Book>>(API_PATHS.book, payload)
    return { data: data.data, message: data.message }
  },

  async update(id: number, payload: BookRequest): Promise<ApiMutationResult<Book>> {
    const { data } = await axiosClient.put<ApiSuccess<Book>>(`${API_PATHS.book}/${id}`, payload)
    return { data: data.data, message: data.message }
  },

  async remove(id: number): Promise<ApiMutationResult<null>> {
    const { data } = await axiosClient.patch<ApiSuccess<null>>(`${API_PATHS.book}/${id}/delete-status`, {
      deleted: true
    })
    return { data: data.data, message: data.message }
  }
}
