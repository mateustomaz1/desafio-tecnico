"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Users, DollarSign } from "lucide-react"
import { useMetricsStore } from "@/lib/store"

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? "text-green-500" : "text-red-500 rotate-180"}`} />
            <span className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {trend.isPositive ? "+" : ""}
              {trend.value}% em relação ao mês anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsCards() {
  const { totalProducts, activeProducts, totalUsers, totalRevenue } = useMetricsStore()

  const metrics = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      description: "Produtos cadastrados",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Produtos Ativos",
      value: activeProducts,
      description: "Produtos disponíveis",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Usuários Cadastrados",
      value: totalUsers.toLocaleString(),
      description: "Total de usuários",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 15, isPositive: true },
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString()}`,
      description: "Receita do mês",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 3, isPositive: false },
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}
