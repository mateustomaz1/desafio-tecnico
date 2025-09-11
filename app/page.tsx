import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Desafio Técnico Front-End</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Sistema completo de gerenciamento de produtos com autenticação, CRUD e dashboard de métricas.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Fazer Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
