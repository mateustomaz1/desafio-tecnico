"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { productSchema, type ProductFormData } from "@/lib/validations"
import { apiClient, type Product } from "@/lib/api"
import { useProductStore, useUIStore } from "@/lib/store"
import { Upload, X, Loader2 } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(product?.thumbnail?.url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addProduct, updateProduct } = useProductStore()
  const { addNotification } = useUIStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          status: product.status,
        }
      : {
          title: "",
          description: "",
          status: true,
        },
  })

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        addNotification({
          type: "error",
          title: "Arquivo muito grande",
          message: "O arquivo deve ter no máximo 10MB",
        })
        return
      }

      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        addNotification({
          type: "error",
          title: "Tipo de arquivo inválido",
          message: "Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)",
        })
        return
      }

      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    setError("")

    try {
      if (product) {
        const updatedProduct = await apiClient.updateProduct(product.id, data)
        updateProduct(product.id, updatedProduct)

        if (thumbnailFile) {
          await apiClient.updateProductThumbnail(product.id, thumbnailFile)
        }

        addNotification({
          type: "success",
          title: "Produto atualizado",
          message: "O produto foi atualizado com sucesso",
        })
      } else {
        const newProduct = await apiClient.createProduct(data)
        addProduct(newProduct)

        if (thumbnailFile) {
          await apiClient.updateProductThumbnail(newProduct.id, thumbnailFile)
        }

        addNotification({
          type: "success",
          title: "Produto criado",
          message: "O produto foi criado com sucesso",
        })
      }

      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar produto"
      setError(errorMessage)
      addNotification({
        type: "error",
        title: "Erro ao salvar produto",
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Editar Produto" : "Novo Produto"}</CardTitle>
        <CardDescription>
          {product ? "Atualize as informações do produto" : "Preencha os dados do novo produto"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Nome do produto"
              {...register("title")}
              aria-invalid={errors.title ? "true" : "false"}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o produto..."
              rows={4}
              {...register("description")}
              aria-invalid={errors.description ? "true" : "false"}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Thumbnail</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 transition-colors hover:border-primary/50">
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeThumbnail}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Selecionar imagem
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">PNG, JPG, GIF, WebP até 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="status" checked={watch("status")} onCheckedChange={(checked) => setValue("status", checked)} />
            <Label htmlFor="status">Produto ativo</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : product ? (
                "Atualizar"
              ) : (
                "Criar"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
