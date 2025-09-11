import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Product } from "./api"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

interface ProductState {
  products: Product[]
  currentProduct: Product | null
  isLoading: boolean
  error: string | null
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  setCurrentProduct: (product: Product | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

interface MetricsState {
  totalProducts: number
  activeProducts: number
  totalUsers: number
  totalRevenue: number
  salesData: Array<{ month: string; sales: number; products: number }>
  categoryData: Array<{ name: string; value: number; color: string }>
  recentActivities: Array<{
    id: string
    type: "create" | "update" | "delete"
    product: string
    user: string
    timestamp: string
  }>
  setMetrics: (metrics: Partial<MetricsState>) => void
  updateSalesData: (data: Array<{ month: string; sales: number; products: number }>) => void
  addActivity: (activity: {
    type: "create" | "update" | "delete"
    product: string
    user: string
  }) => void
}

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  notifications: Array<{
    id: string
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    timestamp: Date
  }>
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
  addNotification: (notification: Omit<UIState["notifications"][0], "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products, error: null }),
  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }))
    useMetricsStore.getState().addActivity({
      type: "create",
      product: product.title,
      user: useAuthStore.getState().user?.name || "Usuário",
    })
  },
  updateProduct: (id, updatedProduct) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    }))
    const product = get().products.find((p) => p.id === id)
    if (product) {
      useMetricsStore.getState().addActivity({
        type: "update",
        product: product.title,
        user: useAuthStore.getState().user?.name || "Usuário",
      })
    }
  },
  deleteProduct: (id) => {
    const product = get().products.find((p) => p.id === id)
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }))
    if (product) {
      useMetricsStore.getState().addActivity({
        type: "delete",
        product: product.title,
        user: useAuthStore.getState().user?.name || "Usuário",
      })
    }
  },
  setCurrentProduct: (product) => set({ currentProduct: product }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

export const useMetricsStore = create<MetricsState>((set, get) => ({
  totalProducts: 245,
  activeProducts: 198,
  totalUsers: 1234,
  totalRevenue: 45231,
  salesData: [
    { month: "Jan", sales: 4000, products: 240 },
    { month: "Fev", sales: 3000, products: 139 },
    { month: "Mar", sales: 2000, products: 980 },
    { month: "Abr", sales: 2780, products: 390 },
    { month: "Mai", sales: 1890, products: 480 },
    { month: "Jun", sales: 2390, products: 380 },
    { month: "Jul", sales: 3490, products: 430 },
    { month: "Ago", sales: 4000, products: 240 },
    { month: "Set", sales: 3000, products: 139 },
    { month: "Out", sales: 2000, products: 980 },
    { month: "Nov", sales: 2780, products: 390 },
    { month: "Dez", sales: 1890, products: 480 },
  ],
  categoryData: [
    { name: "Eletrônicos", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Roupas", value: 25, color: "hsl(var(--chart-2))" },
    { name: "Casa & Jardim", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Esportes", value: 12, color: "hsl(var(--chart-4))" },
    { name: "Livros", value: 8, color: "hsl(var(--chart-5))" },
  ],
  recentActivities: [
    {
      id: "1",
      type: "create",
      product: "Smartphone Galaxy S24",
      user: "João Silva",
      timestamp: "2 minutos atrás",
    },
    {
      id: "2",
      type: "update",
      product: "Notebook Dell Inspiron",
      user: "Maria Santos",
      timestamp: "15 minutos atrás",
    },
    {
      id: "3",
      type: "delete",
      product: "Tablet iPad Air",
      user: "Pedro Costa",
      timestamp: "1 hora atrás",
    },
  ],
  setMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
  updateSalesData: (salesData) => set({ salesData }),
  addActivity: (activity) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: "agora",
    }
    set((state) => ({
      recentActivities: [newActivity, ...state.recentActivities.slice(0, 9)], 
    }))
  },
}))

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: "system",
      notifications: [],
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
        }
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }))
        setTimeout(() => {
          get().removeNotification(newNotification.id)
        }, 5000)
      },
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    },
  ),
)
