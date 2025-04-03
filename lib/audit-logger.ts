import { firestore } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore"

export type AuditAction =
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "import"
  | "approve"
  | "reject"
  | "complete"

export type AuditLogEntry = {
  userId: string
  userName: string
  action: AuditAction
  resourceType: string
  resourceId: string
  details?: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

// Log an audit event
export const logAuditEvent = async (
  userId: string,
  userName: string,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>,
): Promise<void> => {
  try {
    // Create audit log entry
    const logEntry: Omit<AuditLogEntry, "timestamp"> = {
      userId,
      userName,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: "127.0.0.1", // In a real app, you would get this from the request
      userAgent: navigator.userAgent,
    }

    // Add to Firestore
    await addDoc(collection(firestore, "auditLogs"), {
      ...logEntry,
      timestamp: serverTimestamp(),
    })

    console.log("Audit log entry created")
  } catch (error) {
    console.error("Error creating audit log entry:", error)
  }
}

// Get recent audit logs
export const getRecentAuditLogs = async (limit = 100): Promise<AuditLogEntry[]> => {
  try {
    // Create query
    const q = query(collection(firestore, "auditLogs"), orderBy("timestamp", "desc"), limit(limit))

    // Execute query
    const snapshot = await getDocs(q)

    // Convert to array
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as AuditLogEntry
    })
  } catch (error) {
    console.error("Error getting audit logs:", error)
    return []
  }
}

// Get audit logs for a specific resource
export const getResourceAuditLogs = async (resourceType: string, resourceId: string): Promise<AuditLogEntry[]> => {
  try {
    // Create query
    const q = query(collection(firestore, "auditLogs"), orderBy("timestamp", "desc"))

    // Execute query
    const snapshot = await getDocs(q)

    // Filter and convert to array
    return snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as AuditLogEntry
      })
      .filter((log) => log.resourceType === resourceType && log.resourceId === resourceId)
  } catch (error) {
    console.error("Error getting resource audit logs:", error)
    return []
  }
}

