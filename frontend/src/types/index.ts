export interface Certificate {
  mint: string;
  studentName: string;
  courseName: string;
  issuerName: string;
  date: string;
  student: string;
  issuer: string;
  metadataUri: string;
  verified: boolean;
}

export interface Property {
  id: string;
  mint: string;
  name: string;
  totalValue: number;
  totalTokens: number;
  tokensSold: number;
  pricePerToken: number;
  location: string;
  description: string;
  imageUrl: string;
  metadataUri: string;
  monthlyRent: number;
  annualReturn: number;
  status: string;
  created: string;
  tokensAvailable?: number;
  ownershipSold?: string;
}

export interface PropertyHolding {
  property: Property;
  tokensOwned: number;
  ownershipPercentage: number;
  currentValue: number;
  monthlyRentShare: number;
  purchaseDate: string;
}

export interface DashboardSummary {
  totalCertificates: number;
  totalProperties: number;
  totalPropertyValue: number;
  monthlyRentIncome: number;
}

export interface UserDashboard {
  wallet: string;
  summary: DashboardSummary;
  certificates: Certificate[];
  propertyTokens: PropertyHolding[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export type UserRole = 'citizen' | 'issuer' | 'verifier';