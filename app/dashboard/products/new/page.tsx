"use client"

import { ProductForm } from "@/components/products/product-form"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/products")
  }

  const handleCancel = () => {
    router.push("/dashboard/products")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  )
}
