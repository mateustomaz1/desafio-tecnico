import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Formato de email inválido").max(255, "Email muito longo"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome muito longo")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
    email: z.string().min(1, "Email é obrigatório").email("Formato de email inválido").max(255, "Email muito longo"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(100, "Senha muito longa")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
      ),
    verifyPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    phone: z.object({
      country: z
        .string()
        .min(1, "País é obrigatório")
        .max(3, "Código do país muito longo")
        .regex(/^[A-Z]{2,3}$/, "Código do país deve ter 2-3 letras maiúsculas"),
      ddd: z
        .string()
        .min(1, "DDD é obrigatório")
        .min(2, "DDD deve ter pelo menos 2 dígitos")
        .max(3, "DDD deve ter no máximo 3 dígitos")
        .regex(/^\d+$/, "DDD deve conter apenas números"),
      number: z
        .string()
        .min(1, "Número é obrigatório")
        .min(8, "Número deve ter pelo menos 8 dígitos")
        .max(9, "Número deve ter no máximo 9 dígitos")
        .regex(/^\d+$/, "Número deve conter apenas dígitos"),
    }),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Senhas não coincidem",
    path: ["verifyPassword"],
  })

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título muito longo")
    .trim(),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(1000, "Descrição muito longa")
    .trim(),
  status: z.boolean().default(true),
  idThumbnail: z.string().optional(),
})

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z.string().min(1, "Email é obrigatório").email("Formato de email inválido").max(255, "Email muito longo"),
  phone: z.object({
    country: z
      .string()
      .min(1, "País é obrigatório")
      .max(3, "Código do país muito longo")
      .regex(/^[A-Z]{2,3}$/, "Código do país deve ter 2-3 letras maiúsculas"),
    ddd: z
      .string()
      .min(1, "DDD é obrigatório")
      .min(2, "DDD deve ter pelo menos 2 dígitos")
      .max(3, "DDD deve ter no máximo 3 dígitos")
      .regex(/^\d+$/, "DDD deve conter apenas números"),
    number: z
      .string()
      .min(1, "Número é obrigatório")
      .min(8, "Número deve ter pelo menos 8 dígitos")
      .max(9, "Número deve ter no máximo 9 dígitos")
      .regex(/^\d+$/, "Número deve conter apenas dígitos"),
  }),
  street: z.string().max(200, "Endereço muito longo").optional(),
  complement: z.string().max(100, "Complemento muito longo").optional(),
  district: z.string().max(100, "Bairro muito longo").optional(),
  city: z.string().max(100, "Cidade muito longa").optional(),
  state: z.string().max(50, "Estado muito longo").optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(1, "Nova senha é obrigatória")
      .min(6, "Nova senha deve ter pelo menos 6 caracteres")
      .max(100, "Nova senha muito longa")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número",
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  })

export const searchSchema = z.object({
  query: z.string().min(1, "Digite algo para pesquisar").max(100, "Pesquisa muito longa").trim(),
  category: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
})

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Arquivo deve ter no máximo 10MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
      "Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)",
    ),
})

export const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().uuid("ID inválido"))
    .min(1, "Selecione pelo menos um item")
    .max(50, "Máximo de 50 itens por operação"),
})

export const bulkUpdateStatusSchema = z.object({
  ids: z
    .array(z.string().uuid("ID inválido"))
    .min(1, "Selecione pelo menos um item")
    .max(50, "Máximo de 50 itens por operação"),
  status: z.boolean(),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type SearchFormData = z.infer<typeof searchSchema>
export type FileUploadFormData = z.infer<typeof fileUploadSchema>
export type BulkDeleteFormData = z.infer<typeof bulkDeleteSchema>
export type BulkUpdateStatusFormData = z.infer<typeof bulkUpdateStatusSchema>

export const validateEmail = (email: string): boolean => {
  return loginSchema.shape.email.safeParse(email).success
}

export const validatePassword = (password: string): boolean => {
  return loginSchema.shape.password.safeParse(password).success
}

export const validatePhone = (phone: { country: string; ddd: string; number: string }): boolean => {
  return registerSchema.shape.phone.safeParse(phone).success
}

export const getValidationErrorMessage = (error: z.ZodError): string => {
  const firstError = error.errors[0]
  return firstError?.message || "Dados inválidos"
}

export const formatValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    errors[path] = err.message
  })

  return errors
}
