"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Package, Edit, Trash2, Plus } from "lucide-react"
import { useMetricsStore } from "@/lib/store"

function getActivityIcon(type: "create" | "update" | "delete") {
  switch (type) {
    case "create":
      return <Plus className="h-4 w-4 text-green-500" />
    case "update":
      return <Edit className="h-4 w-4 text-blue-500" />
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />
    default:
      return <Package className="h-4 w-4" />
  }
}

function getActivityBadge(type: "create" | "update" | "delete") {
  switch (type) {
    case "create":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Criado</Badge>
    case "update":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Atualizado</Badge>
    case "delete":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Excluído</Badge>
    default:
      return <Badge>Ação</Badge>
  }
}

export function RecentActivity() {
  const { recentActivities } = useMetricsStore()

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas ações realizadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  {getActivityIcon(activity.type)}
                  <p className="text-sm font-medium leading-none">{activity.product}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground">
                  por {activity.user} • {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
