// Author API layer: functions for CRUD requests to /author endpoints.
import axiosClient from './axiosClient'
import { API_PATHS } from '../constants'
import type { ApiSuccess, Author, AuthorRequest, PagedData } from '../types'

function toPagedData(response: ApiSuccess<Author[]>): PagedData<Author> {
  return {
    items: response.data ?? [],
    totalElements: response.totalElements ?? 0,
    totalPages: response.totalPages ?? 0,
    page: response.page ?? 0,
    pageSize: response.pageSize ?? 10
  }
}

export const authorApi = {
  async list(page: number, size: number): Promise<PagedData<Author>> {
    const { data } = await axiosClient.get<ApiSuccess<Author[]>>(API_PATHS.author, {
      params: { page, size }
    })
    return toPagedData(data)
  },

  async create(payload: AuthorRequest): Promise<Author> {
    const { data } = await axiosClient.post<ApiSuccess<Author>>(API_PATHS.author, payload)
    return data.data
  },

  async update(id: number, payload: AuthorRequest): Promise<Author> {
    const { data } = await axiosClient.put<ApiSuccess<Author>>(`${API_PATHS.author}/${id}`, payload)
    return data.data
  },

  async remove(id: number): Promise<void> {
    await axiosClient.patch(`${API_PATHS.author}/${id}/delete-status`, { deleted: true })
  }
}
