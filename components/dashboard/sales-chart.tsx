"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMetricsStore } from "@/lib/store"

export function SalesChart() {
  const { salesData } = useMetricsStore()

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Vendas por Mês</CardTitle>
        <CardDescription>Comparativo de vendas e produtos vendidos nos últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /> 
            <XAxis dataKey="month" stroke="var(--foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Vendas</span>
                          <span className="font-bold text-muted-foreground">R$ {payload[0].value}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Produtos</span>
                          <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="products" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
