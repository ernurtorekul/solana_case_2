import axios from 'axios';
import type { Certificate, Property, PropertyHolding, UserDashboard, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Certificate APIs
export const certificateApi = {
  async getUserCertificates(wallet: string): Promise<Certificate[]> {
    const response = await api.get(`/user/certificates/${wallet}`);
    return response.data.certificates || [];
  },

  async getCertificateDetails(mint: string): Promise<Certificate> {
    const response = await api.get(`/user/certificate/${mint}`);
    return response.data.certificate;
  },

  async verifyCertificates(wallet: string): Promise<Certificate[]> {
    const response = await api.get(`/user/verify/${wallet}`);
    return response.data.certificates || [];
  },

  async mintCertificate(data: {
    issuerPublicKey: string;
    studentPublicKey: string;
    studentName: string;
    courseName: string;
    issuerName: string;
  }): Promise<string> {
    const response = await api.post('/issuer/mintCertificate', data);
    return response.data.data.signature;
  },

  async checkIssuerAuth(publicKey: string): Promise<boolean> {
    const response = await api.get(`/issuer/check/${publicKey}`);
    return response.data.isAuthorized;
  },

  async addIssuer(data: {
    issuerPublicKey: string;
    adminPublicKey: string;
  }): Promise<void> {
    await api.post('/issuer/addIssuer', data);
  },
};

// Property APIs
export const propertyApi = {
  async getAllProperties(): Promise<Property[]> {
    const response = await api.get('/property/info');
    return response.data.properties || [];
  },

  async getProperty(propertyId: string): Promise<Property> {
    const response = await api.get(`/property/${propertyId}`);
    return response.data.property;
  },

  async buyTokens(data: {
    buyerPublicKey: string;
    propertyId: string;
    tokenAmount: number;
  }): Promise<string> {
    const response = await api.post('/property/buy', data);
    return response.data.data.signature;
  },

  async claimRent(data: {
    userPublicKey: string;
    propertyId: string;
  }): Promise<string> {
    const response = await api.post('/property/claim-rent', data);
    return response.data.data.signature;
  },

  async getUserHoldings(wallet: string): Promise<{
    summary: {
      totalProperties: number;
      totalValue: number;
      totalMonthlyRent: number;
      averageReturn: string;
    };
    holdings: PropertyHolding[];
  }> {
    const response = await api.get(`/property/holdings/${wallet}`);
    return {
      summary: response.data.summary,
      holdings: response.data.holdings,
    };
  },
};

// User APIs
export const userApi = {
  async getDashboard(wallet: string): Promise<UserDashboard> {
    const response = await api.get(`/user/dashboard/${wallet}`);
    return response.data;
  },
};

// Error handler for API calls
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};