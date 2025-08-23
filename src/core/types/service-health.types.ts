// Service Health Types

export interface ServiceHealthDto {
  service: string;
  statusCode: number;
  status: ServiceStatus;
  lastChecked?: string; // ISO date string
  responseTime?: number; // in milliseconds
}

export enum ServiceStatus {
  Healthy = 'Healthy',
  Unavailable = 'Unavailable',
  Degraded = 'Degraded'
}

export interface ServiceHealthResponse {
  services: ServiceHealthDto[];
  lastUpdated: string;
}

// Predefined services to monitor
export const MONITORED_SERVICES = [
  'UserIdentity Service',
  'Player Service', 
  'GameSettings Service',
  'Orders Service'
] as const;

export type MonitoredService = typeof MONITORED_SERVICES[number];
