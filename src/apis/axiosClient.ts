// Shared Axios instance: central place for baseURL, headers, and interceptors.
import axios from 'axios'
import type { AxiosError } from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

function formatDetails(details: unknown): string {
  if (typeof details === 'string') {
    return details
  }

  if (Array.isArray(details)) {
    return details
      .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .join(', ')
  }

  if (details && typeof details === 'object') {
    return Object.entries(details as Record<string, unknown>)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(', ')
  }

  return ''
}

function extractErrorMessage(error: AxiosError): string {
  const responseData = error.response?.data as
    | {
        message?: string
        code?: string
        details?: unknown
      }
    | undefined

  const beMessage = responseData?.message?.trim()
  const beCode = responseData?.code?.trim()
  const beDetails = formatDetails(responseData?.details)

  const chunks = [beMessage, beCode ? `(${beCode})` : '', beDetails ? `- ${beDetails}` : ''].filter(Boolean)
  if (chunks.length > 0) {
    return chunks.join(' ')
  }

  return error.message || 'Request failed'
}

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      console.log(response.data)
    }
    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        console.error(error.response.data)
      } else {
        console.error({ message: error.message })
      }
      return Promise.reject(new Error(extractErrorMessage(error)))
    }

    return Promise.reject(error instanceof Error ? error : new Error('Request failed'))
  }
)

export default axiosClient
