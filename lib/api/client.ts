/**
 * API Client
 * Centralized HTTP client for backend API calls
 */
import { API_CONFIG, API_ENDPOINTS } from './config'

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl
    this.timeout = API_CONFIG.timeout
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { detail: response.statusText }
        }
        
        throw new ApiError(
          response.status,
          response.statusText,
          errorData
        )
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const text = await response.text()
        return text ? JSON.parse(text) : ({} as T)
      }

      return {} as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        // Retry once for Render cold starts (free tier sleeps after inactivity)
        if (retries > 0 && endpoint.includes('/health')) {
          console.log('⏳ Service may be waking up, retrying...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          return this.request<T>(endpoint, options, retries - 1)
        }
        throw new ApiError(408, 'Request Timeout', { 
          message: 'Backend service may be sleeping (Render free tier). First request can take up to 60 seconds.' 
        })
      }
      
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('🌐 API Request Failed:', {
        url,
        error: errorMsg,
        baseUrl: this.baseUrl,
      })
      throw new ApiError(500, 'Network Error', { message: errorMsg })
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Don't set Content-Type for FormData - browser will set it with boundary
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { detail: response.statusText }
        }
        
        throw new ApiError(
          response.status,
          response.statusText,
          errorData
        )
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const text = await response.text()
        return text ? JSON.parse(text) : ({} as T)
      }

      return {} as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout', { message: 'Request took too long' })
      }
      
      throw new ApiError(500, 'Network Error', { message: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
export { API_ENDPOINTS }
