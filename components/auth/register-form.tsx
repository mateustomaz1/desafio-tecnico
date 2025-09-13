"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { apiClient } from "@/lib/api"
import { useAuthStore, useUIStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"

// Helper: Password strength bar
function PasswordStrengthBar({ score }: { score: number }) {
  const getBarColor = (level: number) => {
    if (score < level) return "bg-gray-200"
    if (score === 4) return "bg-green-500"
    if (score >= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((level) => (
        <div key={level} className={`h-1 flex-1 rounded ${getBarColor(level)}`} />
      ))}
    </div>
  )
}

// Helper: Password feedback
function PasswordFeedback({ feedback }: { feedback: string[] }) {
  if (!feedback.length) return null
  return <div className="text-xs text-muted-foreground">Necessário: {feedback.join(", ")}</div>
}

// Helper: Phone fields
function PhoneFields({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm>["register"]
  errors: any
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Input
          id="country"
          placeholder="BR"
          {...register("phone.country")}
          aria-invalid={errors.phone?.country ? "true" : "false"}
          className={errors.phone?.country ? "border-destructive" : ""}
        />
        {errors.phone?.country && (
          <p className="text-sm text-destructive" role="alert">
            {errors.phone.country.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="ddd">DDD</Label>
        <Input
          id="ddd"
          placeholder="11"
          {...register("phone.ddd")}
          aria-invalid={errors.phone?.ddd ? "true" : "false"}
          className={errors.phone?.ddd ? "border-destructive" : ""}
        />
        {errors.phone?.ddd && (
          <p className="text-sm text-destructive" role="alert">
            {errors.phone.ddd.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Telefone</Label>
        <Input
          id="number"
          placeholder="999999999"
          {...register("phone.number")}
          aria-invalid={errors.phone?.number ? "true" : "false"}
          className={errors.phone?.number ? "border-destructive" : ""}
        />
        {errors.phone?.number && (
          <p className="text-sm text-destructive" role="alert">
            {errors.phone.number.message}
          </p>
        )}
      </div>
    </div>
  )
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const { setAuth } = useAuthStore()
  const { addNotification } = useUIStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  const password = watch("password")
  const verifyPassword = watch("verifyPassword")

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, feedback: [] }

    const feedback = []
    let score = 0

    if (pwd.length >= 6) score++
    else feedback.push("Pelo menos 6 caracteres")

    if (/[a-z]/.test(pwd)) score++
    else feedback.push("Uma letra minúscula")

    if (/[A-Z]/.test(pwd)) score++
    else feedback.push("Uma letra maiúscula")

    if (/\d/.test(pwd)) score++
    else feedback.push("Um número")

    return { score, feedback }
  }

  const passwordStrength = getPasswordStrength(password || "")

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.register(data)
      apiClient.setToken(response.token)

      const userName = response.user?.name || data.name
      setAuth(response.user, response.token)

      addNotification({
        type: "success",
        title: "Conta criada com sucesso",
        message: `Bem-vindo, ${userName}!`,
      })

      router.push("/dashboard")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta"
      setError(errorMessage)

      addNotification({
        type: "error",
        title: "Erro ao criar conta",
        message: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Preencha os dados para criar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              {...register("name")}
              aria-invalid={errors.name ? "true" : "false"}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <PhoneFields register={register} errors={errors} />

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {password && (
              <div className="space-y-2">
                <PasswordStrengthBar score={passwordStrength.score} />
                <PasswordFeedback feedback={passwordStrength.feedback} />
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="verifyPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="verifyPassword"
                type={showVerifyPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                {...register("verifyPassword")}
                aria-invalid={errors.verifyPassword ? "true" : "false"}
                className={errors.verifyPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                aria-label={showVerifyPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>

            {verifyPassword && password && (
              <div className="flex items-center gap-2 text-xs">
                {password === verifyPassword ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Senhas coincidem</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">Senhas não coincidem</span>
                  </>
                )}
              </div>
            )}

            {errors.verifyPassword && (
              <p className="text-sm text-destructive" role="alert">
                {errors.verifyPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
