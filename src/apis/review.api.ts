// Review API layer: functions for CRUD requests to /review endpoints.
import axiosClient from './axiosClient'
import { API_PATHS } from '../constants'
import type { ApiSuccess, PagedData, Review, ReviewRequest } from '../types'

function toPagedData(response: ApiSuccess<Review[]>): PagedData<Review> {
  return {
    items: response.data ?? [],
    totalElements: response.totalElements ?? 0,
    totalPages: response.totalPages ?? 0,
    page: response.page ?? 0,
    pageSize: response.pageSize ?? 10
  }
}

export const reviewApi = {
  async list(page: number, size: number): Promise<PagedData<Review>> {
    const { data } = await axiosClient.get<ApiSuccess<Review[]>>(API_PATHS.review, {
      params: { page, size }
    })
    return toPagedData(data)
  },

  async create(payload: ReviewRequest): Promise<Review> {
    const { data } = await axiosClient.post<ApiSuccess<Review>>(API_PATHS.review, payload)
    return data.data
  },

  async update(id: number, payload: ReviewRequest): Promise<Review> {
    const { data } = await axiosClient.put<ApiSuccess<Review>>(`${API_PATHS.review}/${id}`, payload)
    return data.data
  },

  async remove(id: number): Promise<void> {
    await axiosClient.patch(`${API_PATHS.review}/${id}/delete-status`, { deleted: true })
  }
}
