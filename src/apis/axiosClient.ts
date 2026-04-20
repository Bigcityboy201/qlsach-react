// Shared Axios instance: central place for baseURL, headers, and interceptors.
import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.details?.message ??
      error?.message ??
      'Request failed'
    return Promise.reject(new Error(message))
  }
)

export default axiosClient
