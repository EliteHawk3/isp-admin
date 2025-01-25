export interface AuditLog {
    userId: string;           // Reference to the user
    action: string;           // Description of the action (e.g., "Mark as Paid")
    previousStatus: string;   // Status before the action
    newStatus: string;        // Status after the action
    timestamp: string;        // When the action was performed
    amount?: number;          // Payment amount (optional)
  }
  