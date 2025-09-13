'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Search, ArrowRight, Smartphone, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScanPage() {
  const [manualInput, setManualInput] = useState('');
  const router = useRouter();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      // Check if it's a certificate ID or wallet address
      if (manualInput.length === 44 && (manualInput.startsWith('BA') || manualInput.startsWith('6z'))) {
        // Looks like a wallet address
        router.push(`/profile/${manualInput.trim()}`);
      } else {
        // Treat as certificate ID
        router.push(`/certificate/${manualInput.trim()}`);
      }
    } else {
      toast.error('Please enter a valid certificate ID or wallet address');
    }
  };

  const sampleCertificates = [
    {
      id: 'cert_blockchain_001',
      title: 'Blockchain Development Certificate',
      student: 'Nurlan Toktar',
      issuer: 'Nazarbayev University'
    },
    {
      id: 'cert_defi_002',
      title: 'Advanced DeFi Protocols',
      student: 'Nurlan Toktar', 
      issuer: 'AITU'
    },
    {
      id: 'cert_product_003',
      title: 'Web3 Product Management',
      student: 'Nurlan Toktar',
      issuer: 'Kaspi.kz Academy'
    }
  ];

  const sampleProfiles = [
    {
      address: 'BA6KCnxU8XYgEghrSDCieoXWiFsbtoM4hpyBEDRYuEeC',
      name: 'Nurlan Toktar',
      certificates: 8,
      institution: 'Multiple Institutions'
    },
    {
      address: '6zWQvbSCx3ohPu2kMT7HRJfdQkdoqwuZFxLaWRodfkfu',
      name: 'Demo Student',
      certificates: 3,
      institution: 'Various Programs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <QrCode className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Certificate & Portfolio Scanner
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Instantly verify blockchain certificates or view student achievements. 
            Perfect for HR professionals and employers.
          </p>
        </div>

        {/* Manual Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
            Enter Certificate ID or Wallet Address
          </h2>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter certificate ID (e.g., cert_blockchain_001) or wallet address..."
                className="w-full px-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
              <Search className="absolute right-4 top-4 w-6 h-6 text-slate-400" />
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary py-4 text-lg flex items-center justify-center space-x-2"
            >
              <span>Verify & View</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">📜 For Certificates:</h3>
              <p className="text-blue-700">Enter the certificate ID to view detailed information, verification status, and download options.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">👤 For Student Profiles:</h3>
              <p className="text-green-700">Enter a wallet address to see all achievements, skills, and verified credentials.</p>
            </div>
          </div>
        </div>

        {/* QR Code Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <Smartphone className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              QR Code Scanning (Future Feature)
            </h2>
            <p className="text-slate-600">
              Mobile QR scanning will be available in the next update
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-slate-900">Open Mobile Camera</h3>
              <p className="text-slate-600 text-sm">Use your phone's camera or QR scanning app</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-slate-900">Scan Certificate QR</h3>
              <p className="text-slate-600 text-sm">Point camera at the QR code on the certificate</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-slate-900">Instant Verification</h3>
              <p className="text-slate-600 text-sm">View verified details and blockchain proof</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Sample Certificates */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-primary-600" />
              Demo Certificates
            </h3>
            <div className="space-y-3">
              {sampleCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/certificate/${cert.id}`)}
                >
                  <h4 className="font-medium text-slate-900">{cert.title}</h4>
                  <p className="text-sm text-slate-600">{cert.student} • {cert.issuer}</p>
                  <p className="text-xs text-slate-500 mt-1">ID: {cert.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Profiles */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-600" />
              Demo Profiles
            </h3>
            <div className="space-y-3">
              {sampleProfiles.map((profile) => (
                <div
                  key={profile.address}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/profile/${profile.address}`)}
                >
                  <h4 className="font-medium text-slate-900">{profile.name}</h4>
                  <p className="text-sm text-slate-600">{profile.certificates} certificates • {profile.institution}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    {profile.address.slice(0, 8)}...{profile.address.slice(-8)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HR Benefits Section */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Perfect for HR & Recruitment</h2>
            <p className="text-primary-100 mb-8 max-w-3xl mx-auto">
              Instantly verify candidate credentials without calling institutions. 
              Access comprehensive skill profiles and verified achievements.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Instant Verification</h3>
                <p className="text-primary-100 text-sm">Verify credentials in seconds, not days</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">Tamper-Proof</h3>
                <p className="text-primary-100 text-sm">Blockchain ensures authenticity</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-semibold mb-2">Global Recognition</h3>
                <p className="text-primary-100 text-sm">Recognized worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}