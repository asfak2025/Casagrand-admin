// types.ts
export interface OrgMember {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPassword: string;
  memberStatus: 'active' | 'inactive';
  role: string[];
  created_at: string;
  updated_at: string;
}

export interface OrganizationData {
  orgId: string;
  orgName: string;
  orgStatus: 'ACTIVE' | 'INACTIVE';
  orgLogo: string;
  orgMembers: OrgMember[];
  orgSupportAccess: string[];
  orgAdminAccess: string[];
  orgCollectionAccess: string[];
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  placeholder: string;
  searchbtn: boolean;
  loading: boolean;
  bodycls: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface TabButtonProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}

export interface TabContentProps {
  data: OrganizationData;
  onEdit: (section: string) => void;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  showPassword: Record<string, boolean>;
  setShowPassword: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export interface BlankProps {
  title: string;
  children: React.ReactNode;
}

// Fixed: Added 'agents' to TabKey type
export type TabKey = 'overview' | 'members' | 'access' | 'agents' | 'documents' | 'billing';

export interface LocationState {
  orgId?: string;
}

export type PhoneNumber = {
  agentId: string;
  agentNo: string | number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  totalCalls: number;
  answered: number;
  missed: number;
  averageDur: number; // duration in seconds or minutes, depending on usage
};

export interface AgentDetails {
  orgId: string;
  agentName: string;
  agentDescription: string;
  memberId: string;
  agentId: string;
  createdBy: string;
  phoneNumbers: PhoneNumber[];
  agentStatus: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt: string;
}

export type BillingRecord = {
  orgId: string;
  orgName: string;
  invoices: Invoice[];
};

export type Invoice = {
  invoiceId: string;
  billingPeriod: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  generatedAt: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: 'UPI' | 'Card' | 'BankTransfer';
  callSummary?: CallSummary;
};

export type CallSummary = {
  startDate: string;
  endDate: string;
  totalCalls: number;
  totalMinutes: number;
  totalCost: number;
  avgCostPerCall: number;
  avgCostPerMinute: number;
};


