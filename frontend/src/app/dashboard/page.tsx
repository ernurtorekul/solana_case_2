'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { userApi, propertyApi, handleApiError } from '@/lib/api';
import type { UserDashboard } from '@/types';
import { 
  Award, 
  Building, 
  TrendingUp, 
  DollarSign,
  ExternalLink,
  Calendar,
  MapPin,
  Percent
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificates' | 'properties'>('certificates');

  useEffect(() => {
    if (connected && publicKey) {
      loadDashboard();
    }
  }, [connected, publicKey]);

  const loadDashboard = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const data = await userApi.getDashboard(publicKey);
      setDashboard(data);
    } catch (error) {
      toast.error('Failed to load dashboard: ' + handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRent = async (propertyId: string) => {
    if (!publicKey) return;

    try {
      const signature = await propertyApi.claimRent({
        userPublicKey: publicKey,
        propertyId
      });
      toast.success(`Rent claimed! Transaction: ${signature.slice(0, 8)}...`);
      loadDashboard(); // Refresh data
    } catch (error) {
      toast.error('Failed to claim rent: ' + handleApiError(error));
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-slate-600">
            Please connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No Data Found
          </h2>
          <p className="text-slate-600">
            Unable to load dashboard data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here&apos;s your portfolio overview.
          </p>
        </div>
        <Link 
          href={`/profile/${publicKey}`}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Award className="w-4 h-4" />
          <span>View Public Portfolio</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Certificates</p>
              <p className="text-2xl font-bold text-slate-900">
                {dashboard.summary.totalCertificates}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Properties</p>
              <p className="text-2xl font-bold text-slate-900">
                {dashboard.summary.totalProperties}
              </p>
            </div>
            <Building className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-slate-900">
                ${dashboard.summary.totalPropertyValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Monthly Income</p>
              <p className="text-2xl font-bold text-slate-900">
                ${dashboard.summary.monthlyRentIncome}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'certificates'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Education
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'properties'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Real Estate
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'properties'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Health
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Education Certificates
            </h2>
            <Link href="/issuer" className="btn btn-primary text-sm">
              Request Certificate
            </Link>
          </div>

          {dashboard.certificates.length === 0 ? (
            <div className="card text-center py-12">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Certificates Yet
              </h3>
              <p className="text-slate-600 mb-4">
                You haven&apos;t received any certificates yet
              </p>
              <Link href="/issuer" className="btn btn-primary">
                Request Your First Certificate
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {dashboard.certificates.map((cert, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <Award className="w-6 h-6 text-blue-600 mt-1" />
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {cert.courseName}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Issued: {cert.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>By: {cert.issuerName}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      NFT: {cert.mint.slice(0, 8)}...
                    </span>
                    <Link 
                      href={`/certificate/${cert.mint}`}
                      className="text-primary-600 text-sm hover:text-primary-700 flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Real Estate Holdings
            </h2>
            <Link href="/properties" className="btn btn-primary text-sm">
              Browse Properties
            </Link>
          </div>

          {dashboard.propertyTokens.length === 0 ? (
            <div className="card text-center py-12">
              <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Property Holdings
              </h3>
              <p className="text-slate-600 mb-4">
                Start investing in fractional real estate
              </p>
              <Link href="/properties" className="btn btn-primary">
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {dashboard.propertyTokens.map((holding, index) => (
                <div key={index} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {holding.propertyName}
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Tokens Owned:</span>
                          <span className="ml-2 font-medium">{holding.tokensOwned}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Ownership:</span>
                          <span className="ml-2 font-medium">{holding.ownershipPercentage}%</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Current Value:</span>
                          <span className="ml-2 font-medium">${holding.currentValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="text-center sm:text-right">
                        <p className="text-sm text-slate-600">Monthly Rent</p>
                        <p className="text-lg font-bold text-green-600">
                          ${holding.monthlyRent}
                        </p>
                      </div>
                      <button
                        onClick={() => handleClaimRent(holding.mint)}
                        className="btn btn-success flex items-center space-x-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>Claim Rent</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}