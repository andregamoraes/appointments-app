'use client'

import axios, { AxiosError } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

/** Request: injeta Authorization */
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<unknown>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('name')
        localStorage.removeItem('type')
        window.location.assign('/')
      }
    }
    return Promise.reject(error)
  }
)
