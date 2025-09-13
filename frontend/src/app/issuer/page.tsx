'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { certificateApi, handleApiError } from '@/lib/api';
import { Award, Shield, User, BookOpen, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface CertificateForm {
  studentPublicKey: string;
  studentName: string;
  courseName: string;
  issuerName: string;
}

export default function IssuerPage() {
  const { connected, publicKey } = useWallet();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [form, setForm] = useState<CertificateForm>({
    studentPublicKey: '',
    studentName: '',
    courseName: '',
    issuerName: '',
  });

  useEffect(() => {
    if (connected && publicKey) {
      checkIssuerAuth();
    }
  }, [connected, publicKey]);

  const checkIssuerAuth = async () => {
    if (!publicKey) return;
    
    setCheckingAuth(true);
    try {
      const authorized = await certificateApi.checkIssuerAuth(publicKey);
      setIsAuthorized(authorized);
      if (!authorized) {
        toast.error('Your wallet is not authorized to issue certificates');
      }
    } catch (error) {
      toast.error('Failed to check authorization: ' + handleApiError(error));
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !isAuthorized) return;

    // Basic validation
    if (!form.studentPublicKey || !form.studentName || !form.courseName || !form.issuerName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate Solana public key format (basic check)
    if (form.studentPublicKey.length < 32) {
      toast.error('Please enter a valid Solana wallet address');
      return;
    }

    setLoading(true);
    try {
      const signature = await certificateApi.mintCertificate({
        issuerPublicKey: publicKey,
        studentPublicKey: form.studentPublicKey,
        studentName: form.studentName,
        courseName: form.courseName,
        issuerName: form.issuerName,
      });

      toast.success(`Certificate minted successfully! Transaction: ${signature.slice(0, 8)}...`);
      
      // Reset form
      setForm({
        studentPublicKey: '',
        studentName: '',
        courseName: '',
        issuerName: form.issuerName, // Keep issuer name
      });
    } catch (error) {
      toast.error('Failed to mint certificate: ' + handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const requestAuthorization = async () => {
    if (!publicKey) return;

    try {
      // In a real app, this would be handled by an admin
      await certificateApi.addIssuer({
        issuerPublicKey: publicKey,
        adminPublicKey: 'Admin1111111111111111111111111111111', // Demo admin
      });
      toast.success('Authorization granted! You can now mint certificates.');
      
      // Automatically recheck authorization status
      setTimeout(() => {
        checkIssuerAuth();
      }, 1000);
    } catch (error) {
      toast.error('Failed to request authorization: ' + handleApiError(error));
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-slate-600">
            Please connect your wallet to access issuer features
          </p>
        </div>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="text-center py-12">
        <div className="card max-w-md mx-auto">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Checking Authorization
          </h2>
          <p className="text-slate-600">
            Verifying your issuer permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Unauthorized Issuer
          </h1>
          <p className="text-slate-600 mb-6">
            Your wallet address is not yet authorized to issue certificates. 
            Click &quot;Request Authorization&quot; below to instantly get demo access.
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">
              Authorized Issuer Requirements:
            </h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Verified educational institution</li>
              <li>• Government-approved training provider</li>
              <li>• Registered company with training programs</li>
              <li>• Platform admin approval</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={requestAuthorization}
              className="btn btn-primary"
            >
              Request Authorization
            </button>
            <button
              onClick={checkIssuerAuth}
              className="btn btn-secondary"
            >
              Recheck Status
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Demo Mode: Authorization is instant - no admin approval needed!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Issue Certificate</h1>
        <p className="text-slate-600 mt-2">
          Mint NFT-based education certificates for students
        </p>
        <div className="inline-flex items-center space-x-2 mt-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <Shield className="w-4 h-4" />
          <span>Authorized Issuer</span>
        </div>
      </div>

      {/* Certificate Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">
              <User className="inline w-4 h-4 mr-1" />
              Student Wallet Address
            </label>
            <input
              type="text"
              value={form.studentPublicKey}
              onChange={(e) => setForm({ ...form, studentPublicKey: e.target.value })}
              placeholder="Enter student's Solana wallet address"
              className="input"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              The wallet address that will receive the certificate NFT
            </p>
          </div>

          <div>
            <label className="label">
              <User className="inline w-4 h-4 mr-1" />
              Student Full Name
            </label>
            <input
              type="text"
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              placeholder="e.g., Aidar Nazarbayev"
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">
              <BookOpen className="inline w-4 h-4 mr-1" />
              Course Name
            </label>
            <input
              type="text"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
              placeholder="e.g., Blockchain Development Bootcamp"
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">
              <Building className="inline w-4 h-4 mr-1" />
              Issuer Name
            </label>
            <input
              type="text"
              value={form.issuerName}
              onChange={(e) => setForm({ ...form, issuerName: e.target.value })}
              placeholder="e.g., Nazarbayev University"
              className="input"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Mint Certificate</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setForm({
                studentPublicKey: '',
                studentName: '',
                courseName: '',
                issuerName: form.issuerName,
              })}
              className="btn btn-secondary"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          How Certificate Minting Works
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Certificate metadata is uploaded to IPFS</li>
          <li>NFT is minted on Solana blockchain</li>
          <li>Certificate is sent to student&apos;s wallet</li>
          <li>Employer/verifier can instantly verify authenticity</li>
        </ol>
      </div>

      {/* Demo Data Helper */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">
          Demo Data (Click to Use)
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setForm({
              ...form,
              studentPublicKey: 'Student111111111111111111111111111111',
              studentName: 'Aidar Nazarbayev'
            })}
            className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
          >
            Demo Student 1
          </button>
          <button
            type="button"
            onClick={() => setForm({
              ...form,
              courseName: 'Blockchain Development',
              issuerName: 'Nazarbayev University'
            })}
            className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
          >
            Demo Course
          </button>
        </div>
      </div>
    </div>
  );
}