'use client';

import React, { useState, useEffect } from 'react';
import { certificateApi, handleApiError } from '@/lib/api';
import { 
  Building2, 
  Award, 
  Shield, 
  MapPin,
  CheckCircle,
  BookOpen,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Issuer {
  address: string;
  name: string;
  type: string;
  country: string;
  verified: boolean;
  totalCertificates: number;
}

interface IssuersSummary {
  universities: number;
  corporateTraining: number;
  government: number;
  totalCertificatesIssued: number;
}

export default function IssuersPage() {
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [summary, setSummary] = useState<IssuersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadIssuers();
  }, []);

  const loadIssuers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3003/api/issuer/authorized');
      const data = await response.json();
      
      if (data.success) {
        setIssuers(data.issuers);
        setSummary(data.summary);
      }
    } catch (error) {
      toast.error('Failed to load issuers: ' + handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('University')) return GraduationCap;
    if (type === 'Corporate Training') return Briefcase;
    if (type === 'Government Agency') return Shield;
    return Building2;
  };

  const getTypeColor = (type: string) => {
    if (type.includes('University')) return 'text-blue-600 bg-blue-100';
    if (type === 'Corporate Training') return 'text-green-600 bg-green-100';
    if (type === 'Government Agency') return 'text-purple-600 bg-purple-100';
    return 'text-slate-600 bg-slate-100';
  };

  const filteredIssuers = selectedType === 'all' 
    ? issuers 
    : issuers.filter(issuer => {
        switch (selectedType) {
          case 'university': return issuer.type.includes('University');
          case 'corporate': return issuer.type === 'Corporate Training';
          case 'government': return issuer.type === 'Government Agency';
          default: return true;
        }
      });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Authorized Oraganization Issuers</h1>
        <p className="text-slate-600 mt-2">
          Trusted institutions verified to issue blockchain certificates in Kazakhstan
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Universities</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.universities}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Corporate Training</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.corporateTraining}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Government Agencies</p>
                <p className="text-2xl font-bold text-purple-600">
                  {summary.government}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Certificates</p>
                <p className="text-2xl font-bold text-slate-900">
                  {summary.totalCertificatesIssued.toLocaleString()}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Issuers', icon: Building2 },
          { key: 'university', label: 'Universities', icon: GraduationCap },
          { key: 'corporate', label: 'Corporate', icon: Briefcase },
          { key: 'government', label: 'Government', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Issuers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssuers.map((issuer, index) => {
          const Icon = getTypeIcon(issuer.type);
          const typeColorClass = getTypeColor(issuer.type);
          
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${typeColorClass} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                {issuer.verified && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {issuer.name}
              </h3>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>{issuer.type}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{issuer.country}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>{issuer.totalCertificates.toLocaleString()} certificates issued</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-mono">
                    {issuer.address.slice(0, 8)}...{issuer.address.slice(-8)}
                  </span>
                  <button className="text-primary-600 text-sm hover:text-primary-700 flex items-center space-x-1">
                    <span>View Certificates</span>
                    <BookOpen className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kazakhstan Vision Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="text-center space-y-4">
          <GraduationCap className="w-16 h-16 mx-auto opacity-80" />
          <h2 className="text-2xl font-bold">
            Building Kazakhstan&apos;s Digital Education Future
          </h2>
          <p className="text-primary-100 max-w-3xl mx-auto">
            This decentralized network of trusted institutions ensures that every certificate issued in Kazakhstan 
            is globally verifiable, tamper-proof, and instantly accessible. From universities to corporate training 
            centers, we&apos;re creating a national ecosystem of verifiable credentials.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{issuers.filter(i => i.verified).length}</div>
              <div className="text-sm text-primary-100">Verified Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {summary ? summary.totalCertificatesIssued.toLocaleString() : '0'}
              </div>
              <div className="text-sm text-primary-100">Certificates on Blockchain</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-primary-100">Fraud Prevention</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          How Issuer Authorization Works
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="font-bold">1</span>
            </div>
            <h4 className="font-semibold">Institution Application</h4>
            <p className="text-sm text-slate-600">
              Educational institutions and training centers apply for authorization through government channels
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="font-bold">2</span>
            </div>
            <h4 className="font-semibold">Verification Process</h4>
            <p className="text-sm text-slate-600">
              Government agencies verify credentials, accreditation status, and compliance with education standards
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="font-bold">3</span>
            </div>
            <h4 className="font-semibold">Blockchain Authorization</h4>
            <p className="text-sm text-slate-600">
              Approved institutions receive blockchain wallet authorization to issue tamper-proof certificates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}