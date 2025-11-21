export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryItem {
  id: number;
  name: string;
  reference?: string;
  description?: string;
  quantity: number;
  min_quantity: number;
  unit_price?: number;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Intervention {
  id: number;
  client_id: number;
  assigned_to?: number;
  intervention_date: Date;
  intervention_time?: string;
  type: string;
  status: 'planned' | 'in_progress' | 'completed' | 'invoiced';
  problem_description: string;
  work_done?: string;
  time_spent?: number;
  labor_cost?: number;
  materials_cost?: number;
  total_cost?: number;
  is_urgent: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InterventionMaterial {
  id: number;
  intervention_id: number;
  inventory_id: number;
  quantity: number;
  unit_price?: number;
  created_at: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export interface Statistics {
  total_interventions: number;
  interventions_this_month: number;
  completed_interventions: number;
  pending_interventions: number;
  urgent_interventions: number;
  total_revenue: number;
  revenue_this_month: number;
  active_clients: number;
  low_stock_items: number;
}
