export type ServiceCategory = 'TODOS' | 'CORTE' | 'BARBA' | 'TINTURA';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // in CLP ($)
  duration: number; // in minutes
  image: string;
  description: string;
  details: string[];
}

export type Role = 'cliente' | 'barbero' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  password?: string; // stored simple password
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: Service;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  professional: string; // 'Andrés' | 'Lissy' | 'Meylin'
  status: 'pending' | 'completed' | 'cancelled' | 'no-show';
  totalPrice: number;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  sub: string;
}
