"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useUIStore } from "@/lib/store"

export function Toaster() {
  const { notifications, removeNotification } = useUIStore()

  return (
    <ToastProvider>
      {notifications.map((notification) => {
        return (
          <Toast key={notification.id} variant={notification.type === "error" ? "destructive" : "default"}>
            <div className="grid gap-1">
              {notification.title && <ToastTitle>{notification.title}</ToastTitle>}
              {notification.message && <ToastDescription>{notification.message}</ToastDescription>}
            </div>
            <ToastClose onClick={() => removeNotification(notification.id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
