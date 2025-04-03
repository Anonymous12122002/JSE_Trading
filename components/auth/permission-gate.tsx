"use client"

import type { ReactNode } from "react"
import { type Role, type Permission, hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/rbac"

type PermissionGateProps = {
  children: ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
}

export default function PermissionGate({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  // In a real app, you would get the user's role from your auth context
  // For demo purposes, we'll use a hardcoded role
  const userRole: Role = "admin"

  // Check if the user has the required permissions
  const hasAccess = permission
    ? hasPermission(userRole, permission)
    : requireAll
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions)

  // Render children if the user has access, otherwise render the fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>
}

