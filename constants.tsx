
import React from 'react';
import { 
  Package, Truck, CheckCircle2, Clock, ArrowRightLeft, 
  RefreshCw, RotateCcw, XCircle, Banknote, AlertCircle, 
  FileText, ClipboardCheck, ClipboardList 
} from 'lucide-react';
import { StatItem } from './types';

export const COLORS = {
  darkBlue: '#1a3762',
  orange: '#ff751f',
  white: '#ffffff',
  slate: '#f8fafc',
  border: '#e2e8f0'
};

export const DASHBOARD_STATS: StatItem[] = [
  { title: "Total parcels", value: "1,284", icon: Package, isOrange: false },
  { title: "Delivery pending", value: "342", icon: Truck, isOrange: true },
  { title: "Delivered", value: "942", icon: CheckCircle2, isOrange: false },
  { title: "Hold", value: "08", icon: Clock, isOrange: true },
  { title: "Partial", value: "15", icon: ArrowRightLeft, isOrange: false },
  { title: "Exchange", value: "22", icon: RefreshCw, isOrange: true },
  { title: "Returned", value: "45", icon: RotateCcw, isOrange: false },
  { title: "Cancelled", value: "12", icon: XCircle, isOrange: true },
  { title: "In Transit", value: "18", icon: Truck, isOrange: false },
];

export const PAYMENT_STATS: StatItem[] = [
  { title: "COD Collected", value: "৳1,20,400", icon: Banknote, isOrange: false },
  { title: "Paid Amount", value: "৳84,200", icon: CheckCircle2, isOrange: true },
  { title: "Unpaid Amount", value: "৳36,200", icon: AlertCircle, isOrange: false },
  { title: "Processing", value: "৳12,000", icon: RefreshCw, isOrange: true },
  { title: "Total Invoices", value: "42", icon: FileText, isOrange: false },
  { title: "Paid Invoices", value: "30", icon: ClipboardCheck, isOrange: true },
  { title: "Unpaid Invoices", value: "12", icon: ClipboardList, isOrange: false },
];
