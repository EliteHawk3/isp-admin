export interface Package {
  id: string; // Unique identifier for the package
  name: string; // Name of the package
  speed: number; // Speed in Mbps (non-negative)
  cost: number; // Monthly cost (non-negative)
  users: number; // Number of active users subscribed to this package
}
