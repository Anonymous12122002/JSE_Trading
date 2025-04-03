// Role-based access control (RBAC) types and utilities

export type Role = "admin" | "manager" | "driver" | "viewer"

export type Permission =
  // Vehicle permissions
  | "vehicles:view"
  | "vehicles:create"
  | "vehicles:edit"
  | "vehicles:delete"
  // Driver permissions
  | "drivers:view"
  | "drivers:create"
  | "drivers:edit"
  | "drivers:delete"
  // Trip permissions
  | "trips:view"
  | "trips:create"
  | "trips:edit"
  | "trips:delete"
  | "trips:complete"
  // Expense permissions
  | "expenses:view"
  | "expenses:create"
  | "expenses:edit"
  | "expenses:delete"
  | "expenses:approve"
  // Report permissions
  | "reports:view"
  | "reports:create"
  | "reports:export"
  // Settings permissions
  | "settings:view"
  | "settings:edit"

// Define role-based permissions
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "vehicles:delete",
    "drivers:view",
    "drivers:create",
    "drivers:edit",
    "drivers:delete",
    "trips:view",
    "trips:create",
    "trips:edit",
    "trips:delete",
    "trips:complete",
    "expenses:view",
    "expenses:create",
    "expenses:edit",
    "expenses:delete",
    "expenses:approve",
    "reports:view",
    "reports:create",
    "reports:export",
    "settings:view",
    "settings:edit",
  ],
  manager: [
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "drivers:view",
    "drivers:create",
    "drivers:edit",
    "trips:view",
    "trips:create",
    "trips:edit",
    "trips:complete",
    "expenses:view",
    "expenses:create",
    "expenses:edit",
    "expenses:approve",
    "reports:view",
    "reports:create",
    "reports:export",
    "settings:view",
  ],
  driver: [
    "vehicles:view",
    "drivers:view",
    "trips:view",
    "trips:create",
    "trips:complete",
    "expenses:view",
    "expenses:create",
    "reports:view",
  ],
  viewer: ["vehicles:view", "drivers:view", "trips:view", "expenses:view", "reports:view"],
}

// Check if a user has a specific permission
export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission)
}

// Check if a user has all of the specified permissions
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

// Check if a user has any of the specified permissions
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

