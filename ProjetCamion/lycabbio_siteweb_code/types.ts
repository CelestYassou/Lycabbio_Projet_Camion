export interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface HiveData {
  id: number;
  name: string;
  temperature: number;
  humidity: number;
  weight: number;
  status: 'optimal' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface Bee {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  angle: number;
}