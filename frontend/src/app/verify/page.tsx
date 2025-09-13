'use client';

import React, { useState } from 'react';
import { certificateApi, handleApiError } from '@/lib/api';
import type { Certificate } from '@/types';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Award, 
  Calendar,
  Building,
  User,
  ExternalLink,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    // Basic validation for Solana address length
    if (walletAddress.trim().length < 32) {
      toast.error('Please enter a valid Solana wallet address');
      return;
    }

    setLoading(true);
    setSearched(false);
    
    try {
      const verifiedCerts = await certificateApi.verifyCertificates(walletAddress.trim());
      setCertificates(verifiedCerts);
      setSearched(true);
      
      if (verifiedCerts.length === 0) {
        toast('No verified certificates found for this wallet', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${verifiedCerts.length} verified certificate(s)`);
      }
    } catch (error) {
      toast.error('Failed to verify certificates: ' + handleApiError(error));
      setCertificates([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatWalletAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-900">Verify Certificates</h1>
        <p className="text-slate-600 mt-2">
          Instantly verify the authenticity of education certificates on the blockchain
        </p>
      </div>

      {/* Search Form */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="label">
              <User className="inline w-4 h-4 mr-1" />
              Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Solana wallet address to verify certificates"
                className="input flex-1"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !walletAddress.trim()}
                className="btn btn-primary flex items-center space-x-2 px-6"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter the wallet address of the certificate holder
            </p>
          </div>

          {/* Demo Wallet Buttons */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Try Demo Wallets:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setWalletAddress('Student111111111111111111111111111111')}
                className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300"
              >
                Demo Student 1
              </button>
              <button
                type="button"
                onClick={() => setWalletAddress('Student222222222222222222222222222222')}
                className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300"
              >
                Demo Student 2
              </button>
              <button
                type="button"
                onClick={() => setWalletAddress('EmptyWallet11111111111111111111111111')}
                className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded hover:bg-slate-300"
              >
                No Certificates
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Verification Results
            </h2>
            {certificates.length > 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {certificates.length} Verified Certificate(s)
                </span>
              </div>
            )}
          </div>

          {/* Wallet Info */}
          <div className="card bg-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-700">Wallet Address</h3>
                <p className="text-lg font-mono text-slate-900 mt-1">
                  {formatWalletAddress(walletAddress)}
                </p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                certificates.length > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {certificates.length > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>No Certificates</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Certificates List */}
          {certificates.length === 0 ? (
            <div className="card text-center py-12">
              <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Verified Certificates Found
              </h3>
              <p className="text-slate-600">
                This wallet address has no verified education certificates on the blockchain.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {certificates.map((cert, index) => (
                <div key={index} className="card border-l-4 border-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Award className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {cert.courseName}
                        </h3>
                        <p className="text-slate-600">Certificate of Completion</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Student:</span>
                        <span className="font-medium text-slate-900">{cert.studentName}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">Issued by:</span>
                        <span className="font-medium text-slate-900">{cert.issuerName}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Issue Date:</span>
                        <span className="font-medium text-slate-900">{cert.date}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">NFT Mint:</span>
                        <span className="font-mono text-xs text-slate-900">
                          {cert.mint.slice(0, 8)}...{cert.mint.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-xs text-slate-500">
                      Blockchain verified • Tamper-proof • Globally verifiable
                    </div>
                    
                    <button className="text-primary-600 text-sm hover:text-primary-700 flex items-center space-x-1">
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">
          How Certificate Verification Works
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Certificates are stored as NFTs on Solana blockchain</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Metadata is permanently stored on IPFS</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Only authorized institutions can issue certificates</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Instant verification without contacting issuers</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Impossible to forge or tamper with</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
              <span>Globally accessible and verifiable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}