export interface AuthToken {
    token: string; // JWT token
    expiresAt: string; // Expiration time
  }
  
  export interface UserCredentials {
    username: string;
    password: string;
  }
  