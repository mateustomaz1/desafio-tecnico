"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"
import { apiClient, type Product } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditProductPageProps {
  params: { id: string }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getProduct(params.id)
      setProduct(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produto")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push("/dashboard/products")
  }

  const handleCancel = () => {
    router.push("/dashboard/products")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!product) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Produto não encontrado</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProductForm product={product} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
