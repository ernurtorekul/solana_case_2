'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  Clock,
  TrendingUp,
  Star,
  Briefcase,
  ExternalLink,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issuerName: string;
  issuerType: string;
  issuedDate: string;
  grade?: string;
  skills: string[];
  verified: boolean;
}

interface StudentProfile {
  address: string;
  name: string;
  totalCertificates: number;
  verifiedCertificates: number;
  totalSkills: number;
  joinedDate: string;
  certificates: Certificate[];
  topSkills: string[];
  achievements: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function StudentProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (params.address) {
      loadProfile(params.address as string);
    }
  }, [params.address]);

  const loadProfile = async (address: string) => {
    setLoading(true);
    try {
      const mockProfile: StudentProfile = {
        address: address,
        name: 'Nurlan Toktar',
        totalCertificates: 8,
        verifiedCertificates: 8,
        totalSkills: 12,
        joinedDate: '2023-01-15',
        certificates: [
          {
            id: 'cert_blockchain_001',
            studentName: 'Nurlan Toktar',
            courseName: 'Blockchain Development Fundamentals',
            issuerName: 'Nazarbayev University',
            issuerType: 'University',
            issuedDate: '2024-12-10',
            grade: 'A+',
            skills: ['Solana Development', 'Rust Programming', 'Smart Contracts'],
            verified: true
          },
          {
            id: 'cert_defi_002',
            studentName: 'Nurlan Toktar',
            courseName: 'Advanced DeFi Protocols',
            issuerName: 'AITU',
            issuerType: 'University',
            issuedDate: '2024-11-15',
            grade: 'A',
            skills: ['DeFi', 'Liquidity Pools', 'Yield Farming'],
            verified: true
          },
          {
            id: 'cert_product_003',
            studentName: 'Nurlan Toktar',
            courseName: 'Web3 Product Management',
            issuerName: 'Kaspi.kz Academy',
            issuerType: 'Corporate Training',
            issuedDate: '2024-10-20',
            grade: 'A',
            skills: ['Product Management', 'Web3 Strategy', 'User Research'],
            verified: true
          },
          {
            id: 'cert_startup_004',
            studentName: 'Nurlan Toktar',
            courseName: 'Blockchain Startup Accelerator',
            issuerName: 'Astana Hub Accelerator',
            issuerType: 'Accelerator Program',
            issuedDate: '2024-09-10',
            skills: ['Entrepreneurship', 'Blockchain Business', 'Pitch Deck'],
            verified: true
          }
        ],
        topSkills: [
          'Solana Development',
          'Smart Contracts',
          'DeFi Protocols',
          'Rust Programming',
          'Web3 Product Management'
        ],
        achievements: [
          {
            title: 'Top Graduate',
            description: 'Graduated with highest honors from blockchain program',
            icon: '🏆'
          },
          {
            title: 'Innovation Award',
            description: 'Won best innovation project in Web3 category',
            icon: '💡'
          },
          {
            title: 'Community Leader',
            description: 'Active contributor to Kazakhstan blockchain community',
            icon: '👥'
          }
        ]
      };
      
      setProfile(mockProfile);
    } catch (error) {
      toast.error('Failed to load student profile');
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
    toast.success('Profile link copied!');
  };

  const downloadPortfolio = () => {
    toast.success('Portfolio download started');
  };

  const profileUrl = typeof window !== 'undefined' ? window.location.href : '';

  const filteredCertificates = profile?.certificates.filter(cert => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'university') return cert.issuerType.includes('University');
    if (selectedFilter === 'corporate') return cert.issuerType === 'Corporate Training';
    if (selectedFilter === 'accelerator') return cert.issuerType.includes('Accelerator');
    return true;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile Not Found</h1>
          <p className="text-slate-600">The requested student profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <span className="text-sm font-medium text-slate-600">Verified Student Portfolio</span>
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
              <span>Share Portfolio</span>
            </button>
            <button
              onClick={downloadPortfolio}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
          </div>
        </div>

        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 text-center">Student Portfolio QR</h3>
              <div className="flex justify-center mb-4">
                <QRCode value={profileUrl} size={200} />
              </div>
              <p className="text-sm text-slate-600 text-center mb-4">
                Scan to view this student portfolio
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

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4"> 
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
                    <p className="text-slate-600 mb-2">Blockchain Developer & Web3 Enthusiast</p>
                    <p className="text-sm text-slate-500">
                      Member since {new Date(profile.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{profile.totalCertificates}</div>
                  <div className="text-sm text-slate-600">Certificates</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{profile.verifiedCertificates}</div>
                  <div className="text-sm text-slate-600">Verified</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{profile.totalSkills}</div>
                  <div className="text-sm text-slate-600">Skills</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Certificates & Credentials</h2>
                
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'university', label: 'University' },
                    { key: 'corporate', label: 'Corporate' },
                    { key: 'accelerator', label: 'Accelerator' }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setSelectedFilter(filter.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedFilter === filter.key
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredCertificates.map((cert) => (
                  <div key={cert.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{cert.courseName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{cert.issuerName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(cert.issuedDate).toLocaleDateString()}</span>
                          </div>
                          {cert.grade && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>Grade: {cert.grade}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cert.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        {cert.verified && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        )}
                        <Link
                          href={`/certificate/${cert.id}`}
                          className="btn btn-sm btn-primary flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Skills</h3>
              <div className="space-y-3">
                {profile.topSkills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-700">{skill}</span>
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${Math.max(60, 100 - index * 10)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h3>
              <div className="space-y-4">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Blockchain Verified
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500">Wallet Address:</span>
                  <p className="font-mono text-slate-700 break-all">{profile.address}</p>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>All certificates verified on Solana</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-700">
                  <Globe className="w-4 h-4" />
                  <span>Globally accessible & tamper-proof</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>This portfolio is powered by Kazakhstan National Tokenization Hub</p>
          <p className="mt-2">All credentials are blockchain-verified and globally recognizable</p>
        </div>
      </div>
    </div>
  );
}