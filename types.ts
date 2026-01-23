
import { LucideIcon } from 'lucide-react';

export interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  isOrange: boolean;
}

export type TabType = 'home' | 'orders' | 'invoices' | 'profile' | 'fraud_check' | 'pickup';

export interface BusinessStats {
  totalParcels: number;
  pending: number;
  delivered: number;
  hold: number;
  successRate: string;
  returnRate: string;
  paidInvoices: number;
  unpaidInvoices: number;
}
