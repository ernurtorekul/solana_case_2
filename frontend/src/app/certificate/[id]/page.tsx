'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { 
  Award, 
  Calendar, 
  User, 
  Building2, 
  Shield, 
  Download,
  Share,
  Copy,
  CheckCircle,
  GraduationCap,
  Globe,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issuerName: string;
  issuerType: string;
  issuedDate: string;
  blockchainHash: string;
  metadataUri: string;
  issuerAddress: string;
  studentAddress: string;
  verified: boolean;
  grade?: string;
  description?: string;
  skills?: string[];
  issuerLogo?: string;
}

export default function CertificateDetailsPage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadCertificate(params.id as string);
    }
  }, [params.id]);

  const loadCertificate = async (certificateId: string) => {
    setLoading(true);
    try {
      const mockCertificate: Certificate = {
        id: certificateId,
        studentName: 'Nurlan Toktar',
        courseName: 'Blockchain Development Fundamentals',
        issuerName: 'Nazarbayev University',
        issuerType: 'University',
        issuedDate: '2024-12-10',
        blockchainHash: '5VGxBMTsBUgMF3FbhjbQYCtKL6UDJdHhAD6F7M4R1Q2k9X9nP8Wj7wZqBvLt3CxD5Fy2Y8GmH4J6K7LqNr1P',
        metadataUri: 'https://ipfs.io/ipfs/QmX...',
        issuerAddress: 'NU11111111111111111111111111111111111111',
        studentAddress: 'BA6KCnxU8XYgEghrSDCieoXWiFsbtoM4hpyBEDRYuEeC',
        verified: true,
        grade: 'A+',
        description: 'Comprehensive course covering Solana blockchain development, smart contracts, and DeFi protocols.',
        skills: ['Solana Development', 'Rust Programming', 'Smart Contracts', 'DeFi', 'Anchor Framework'],
        issuerLogo: '🏛️'
      };
      
      setCertificate(mockCertificate);
    } catch (error) {
      toast.error('Failed to load certificate details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const shareProfile = () => {
    const url = window.location.href;
    copyToClipboard(url);
    toast.success('Certificate link copied!');
  };

  const downloadCertificate = () => {
    toast.success('Certificate download started');
  };

  const certificateUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Certificate Not Found</h1>
          <p className="text-slate-600">The requested certificate could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-slate-600">Verified Certificate</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowQR(!showQR)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>QR Code</span>
            </button>
            <button
              onClick={shareProfile}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={downloadCertificate}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 text-center">Certificate QR Code</h3>
              <div className="flex justify-center mb-4">
                <QRCode value={certificateUrl} size={200} />
              </div>
              <p className="text-sm text-slate-600 text-center mb-4">
                Scan to view this certificate
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-8 py-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">{certificate.issuerLogo}</div>
              <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
              <p className="text-primary-100 text-lg">Blockchain-Verified Credential</p>
            </div>
          </div>

          <div className="px-8 py-12">
            
            <div className="text-center mb-12">
              <h2 className="text-2xl font-light text-slate-600 mb-4">This is to certify that</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-6">{certificate.studentName}</h3>
              <h4 className="text-xl font-light text-slate-600 mb-2">has successfully completed</h4>
              <h5 className="text-3xl font-semibold text-primary-600 mb-8">{certificate.courseName}</h5>
              
              {certificate.grade && (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Grade: {certificate.grade}</span>
                </div>
              )}

              <div className="flex justify-center items-center space-x-8 text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>{certificate.issuerName}</span>
                </div>
              </div>
            </div>

            {certificate.description && (
              <div className="mb-8 p-6 bg-slate-50 rounded-lg">
                <h6 className="font-semibold text-slate-900 mb-3">Course Description</h6>
                <p className="text-slate-600">{certificate.description}</p>
              </div>
            )}

            {certificate.skills && certificate.skills.length > 0 && (
              <div className="mb-8">
                <h6 className="font-semibold text-slate-900 mb-4">Skills Acquired</h6>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div>
                <h6 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Blockchain Verification
                </h6>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">Transaction Hash:</span>
                    <p className="font-mono text-slate-700 break-all">{certificate.blockchainHash}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Issuer Address:</span>
                    <p className="font-mono text-slate-700 break-all">{certificate.issuerAddress}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Student Address:</span>
                    <p className="font-mono text-slate-700 break-all">{certificate.studentAddress}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h6 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Issuer Information
                </h6>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">Institution:</span>
                    <p className="font-medium text-slate-700">{certificate.issuerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Type:</span>
                    <p className="text-slate-700">{certificate.issuerType}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Country:</span>
                    <p className="text-slate-700">Kazakhstan</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-700 font-medium">Verified Institution</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-3 bg-green-100 text-green-800 px-6 py-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Verified on Solana Blockchain</span>
                <Globe className="w-5 h-5" />
              </div>
              <p className="text-slate-500 text-sm mt-3">
                This certificate is cryptographically secured and globally verifiable
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by Kazakhstan National Tokenization Hub</p>
          <p className="flex items-center justify-center space-x-1 mt-2">
            <Clock className="w-4 h-4" />
            <span>Generated on {new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}