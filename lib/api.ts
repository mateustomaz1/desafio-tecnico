const API_BASE_URL = "https://api-teste-front-production.up.railway.app"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  verifyPassword: string
  phone: {
    country: string
    ddd: string
    number: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  platformRole: string
  status: string
  emailStatus: string
  createdAt: string
  updatedAt: string
  phone: {
    country: string
    ddd: string
    number: string
  }
  avatar?: Array<{
    id: string
    url: string
  }>
  street?: string
  complement?: string
  district?: string
  city?: string
  state?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  codeIntern: string
  message: string
}

export interface Product {
  id: string
  userId: string
  title: string
  description: string
  status: boolean
  idThumbnail: string
  createdAt: string
  updatedAt: string
  thumbnail?: {
    id: string
    userId: string
    url: string
    size: number
    originalName: string
    mimeType: string
    key: string
    idModule: string
    createdAt: string
    updatedAt: string
  }
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message || "API Error")
    }

    return response.json()
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async refreshSession(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/session", {
      method: "POST",
    })
  }

  async getProducts(): Promise<Product[]> {
    if (typeof window !== "undefined") {
      const localProducts = localStorage.getItem("local-products")
      return localProducts ? JSON.parse(localProducts) : []
    }
    return []
  }

  async getProduct(id: string): Promise<{ data: Product }> {
    if (typeof window !== "undefined") {
      const localProducts = JSON.parse(localStorage.getItem("local-products") || "[]")
      const product = localProducts.find((p: Product) => p.id === id)
      if (product) {
        return { data: product }
      }
    }

    return this.request<{ data: Product }>(`/products/${id}`)
  }

  async createProduct(data: Omit<Product, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      userId: "local-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idThumbnail: "",
    }

    if (typeof window !== "undefined") {
      const localProducts = JSON.parse(localStorage.getItem("local-products") || "[]")
      localProducts.push(newProduct)
      localStorage.setItem("local-products", JSON.stringify(localProducts))
    }

    return newProduct
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    if (typeof window !== "undefined") {
      const localProducts = JSON.parse(localStorage.getItem("local-products") || "[]")
      const productIndex = localProducts.findIndex((p: Product) => p.id === id)

      if (productIndex !== -1) {
        localProducts[productIndex] = { ...localProducts[productIndex], ...data, updatedAt: new Date().toISOString() }
        localStorage.setItem("local-products", JSON.stringify(localProducts))
        return localProducts[productIndex]
      }
    }

    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string): Promise<{ codeIntern: string; message: string }> {
    if (typeof window !== "undefined") {
      const localProducts = JSON.parse(localStorage.getItem("local-products") || "[]")
      const filteredProducts = localProducts.filter((p: Product) => p.id !== id)
      localStorage.setItem("local-products", JSON.stringify(filteredProducts))
    }

    try {
      return await this.request<{ codeIntern: string; message: string }>(`/products/${id}`, {
        method: "DELETE",
      })
    } catch {
      return { codeIntern: "LOCAL_DELETE", message: "Produto removido localmente" }
    }
  }

  async updateProductThumbnail(id: string, thumbnail: File): Promise<{ codeIntern: string; message: string }> {
    if (typeof window !== "undefined") {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const localProducts = JSON.parse(localStorage.getItem("local-products") || "[]")
          const productIndex = localProducts.findIndex((p: Product) => p.id === id)

          if (productIndex !== -1) {
            localProducts[productIndex].thumbnail = {
              id: Date.now().toString(),
              userId: "local-user",
              url: reader.result as string,
              size: thumbnail.size,
              originalName: thumbnail.name,
              mimeType: thumbnail.type,
              key: `local-${Date.now()}`,
              idModule: "local",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            localStorage.setItem("local-products", JSON.stringify(localProducts))
            resolve({ codeIntern: "LOCAL_UPLOAD", message: "Thumbnail atualizada localmente" })
          } else {
            reject(new Error("Produto não encontrado"))
          }
        }
        reader.onerror = () => reject(new Error("Erro ao processar imagem"))
        reader.readAsDataURL(thumbnail)
      })
    }

    const formData = new FormData()
    formData.append("thumbnail", thumbnail)

    const url = `${this.baseURL}/products/thumbnail/${id}`
    const headers: HeadersInit = {}

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.message || "API Error")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()

