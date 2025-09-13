'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/WalletProvider';
import { 
  Shield, 
  Award, 
  Building, 
  Users, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { connected } = useWallet();

  const features = [
    {
      icon: Award,
      title: 'Education Certificates',
      description: 'Universities and companies issue verifiable NFT certificates that prove achievements and skills.',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Building,
      title: 'Real Estate Tokenization',
      description: 'Split properties into fractional tokens, enabling citizens to invest with small amounts.',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Shield,
      title: 'National Registry',
      description: 'Secure blockchain registry where citizens\' skills and assets are transparently verified.',
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const benefits = [
    'Tamper-proof credential verification',
    'Fractional real estate ownership',
    'Automated rent distribution',
    'Global competitiveness',
    'Transparent governance',
    'Reduced bureaucracy',
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <span className="text-sm font-medium text-slate-600 bg-yellow-100 px-3 py-1 rounded-full">
            Hackathon MVP Demo
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
          National Tokenization
          <br />
          <span className="text-primary-600">Hub</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Kazakhstan&apos;s blockchain-powered citizen platform built on Solana. 
          The missing trust layer for government digital systems and financial services.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!connected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                Connect your wallet to access the platform features
              </p>
            </div>
          ) : (
            <>
              <Link href="/dashboard" className="btn btn-primary inline-flex items-center">
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/verify" className="btn btn-secondary inline-flex items-center">
                Verify Certificates
                <CheckCircle className="ml-2 w-4 h-4" />
              </Link>
            </>
          )}
          <Link href="/issuers" className="btn btn-secondary inline-flex items-center">
            View All Institutions
            <Users className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="card text-center space-y-4">
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* MVP Modules Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Hackathon MVP Modules
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-slate-900">
                Education Certificates (NFTs)
              </h3>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>Universities/companies act as issuers</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>NFT-based certificates with metadata on IPFS</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>Instant verification for employers/government</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-slate-900">
                Real Estate Tokenization
              </h3>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>Properties split into fungible SPL tokens</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>Buy small shares starting from $100</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                <span>Proportional rent distribution simulation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Why Kazakhstan Needs This Platform
          </h2>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Building trust and transparency in digital services while making 
            Kazakhstan globally competitive in the blockchain economy.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-left">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Certificate Issuers', value: '9', icon: Users },
          { label: 'Total Certificates', value: '24K+', icon: Award },
          { label: 'Properties Available', value: '2', icon: Building },
          { label: 'Platform ROI', value: '15%', icon: TrendingUp },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card text-center">
              <Icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tech Stack Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Built with Modern Tech Stack
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-purple-600 font-bold">S</span>
            </div>
            <h3 className="font-medium">Solana</h3>
            <p className="text-sm text-slate-600">Blockchain</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-blue-600 font-bold">R</span>
            </div>
            <h3 className="font-medium">React</h3>
            <p className="text-sm text-slate-600">Frontend</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-green-600 font-bold">N</span>
            </div>
            <h3 className="font-medium">Node.js</h3>
            <p className="text-sm text-slate-600">Backend</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-orange-600 font-bold">I</span>
            </div>
            <h3 className="font-medium">IPFS</h3>
            <p className="text-sm text-slate-600">Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
}