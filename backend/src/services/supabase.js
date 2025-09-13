const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    this.isConfigured = !!(supabaseUrl && supabaseAnonKey && 
                          supabaseUrl !== 'your_supabase_url_here' && 
                          supabaseAnonKey !== 'your_supabase_anon_key_here');
    
    if (this.isConfigured) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('✅ Supabase connected successfully');
    } else {
      console.log('⚠️ Supabase not configured, using fallback mock data');
      this.initializeMockData();
    }
  }

  initializeMockData() {
    // Fallback mock data when Supabase isn't configured
    this.mockCertificates = [
      {
        id: 1,
        mint: 'CertMint1111111111111111111111111111111',
        student_name: 'Aidar Nazarbayev',
        course_name: 'Blockchain Development',
        issuer_name: 'Nazarbayev University',
        issue_date: '2024-11-15',
        student_wallet: 'Student111111111111111111111111111111',
        issuer_wallet: 'Issuer1111111111111111111111111111111',
        metadata_uri: 'https://gateway.pinata.cloud/ipfs/QmMockHash123456789',
        verified: true,
        created_at: '2024-11-15T10:00:00Z'
      },
      {
        id: 2,
        mint: 'CertMint2222222222222222222222222222222',
        student_name: 'Aida Toleukhan',
        course_name: 'Smart Contract Security',
        issuer_name: 'AITU',
        issue_date: '2024-10-20',
        student_wallet: 'Student222222222222222222222222222222',
        issuer_wallet: 'Issuer1111111111111111111111111111111',
        metadata_uri: 'https://gateway.pinata.cloud/ipfs/QmMockHash987654321',
        verified: true,
        created_at: '2024-10-20T14:30:00Z'
      }
    ];

    this.mockIssuers = [
      {
        id: 1,
        wallet_address: 'Demo1111111111111111111111111111111111',
        name: 'Dulaty University',
        type: 'University',
        country: 'Kazakhstan',
        verified: true,
        total_certificates: 150,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        wallet_address: 'NU11111111111111111111111111111111111111',
        name: 'Nazarbayev University',
        type: 'University',
        country: 'Kazakhstan',
        verified: true,
        total_certificates: 2547,
        created_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  // Certificate operations
  async createCertificate(certificateData) {
    if (!this.isConfigured) {
      // Mock implementation
      const newCert = {
        id: this.mockCertificates.length + 1,
        mint: certificateData.mint,
        student_name: certificateData.studentName,
        course_name: certificateData.courseName,
        issuer_name: certificateData.issuerName,
        issue_date: certificateData.date,
        student_wallet: certificateData.student,
        issuer_wallet: certificateData.issuer,
        metadata_uri: certificateData.metadataUri,
        verified: true,
        created_at: new Date().toISOString()
      };
      
      this.mockCertificates.push(newCert);
      return { data: newCert, error: null };
    }

    const { data, error } = await this.supabase
      .from('certificates')
      .insert([
        {
          mint: certificateData.mint,
          student_name: certificateData.studentName,
          course_name: certificateData.courseName,
          issuer_name: certificateData.issuerName,
          issue_date: certificateData.date,
          student_wallet: certificateData.student,
          issuer_wallet: certificateData.issuer,
          metadata_uri: certificateData.metadataUri,
          verified: true
        }
      ])
      .select();

    return { data, error };
  }

  async getCertificatesByWallet(walletAddress) {
    if (!this.isConfigured) {
      // Mock implementation
      const userCerts = this.mockCertificates.filter(cert => 
        cert.student_wallet === walletAddress || 
        cert.student_wallet.includes('Student') || 
        walletAddress === 'Demo1111111111111111111111111111111111'
      );
      return { data: userCerts, error: null };
    }

    const { data, error } = await this.supabase
      .from('certificates')
      .select('*')
      .eq('student_wallet', walletAddress);

    return { data, error };
  }

  async getCertificateByMint(mintAddress) {
    if (!this.isConfigured) {
      const cert = this.mockCertificates.find(c => c.mint === mintAddress);
      return { data: cert, error: cert ? null : { message: 'Certificate not found' } };
    }

    const { data, error } = await this.supabase
      .from('certificates')
      .select('*')
      .eq('mint', mintAddress)
      .single();

    return { data, error };
  }

  async getVerifiedCertificates(walletAddress) {
    if (!this.isConfigured) {
      const verifiedCerts = this.mockCertificates
        .filter(cert => (cert.student_wallet === walletAddress || 
                        cert.student_wallet.includes('Student') || 
                        walletAddress === 'Demo1111111111111111111111111111111111') && cert.verified);
      return { data: verifiedCerts, error: null };
    }

    const { data, error } = await this.supabase
      .from('certificates')
      .select('*')
      .eq('student_wallet', walletAddress)
      .eq('verified', true);

    return { data, error };
  }

  // Issuer operations
  async createIssuer(issuerData) {
    if (!this.isConfigured) {
      const newIssuer = {
        id: this.mockIssuers.length + 1,
        wallet_address: issuerData.issuerPublicKey,
        name: issuerData.name || 'New Issuer',
        type: issuerData.type || 'Institution',
        country: 'Kazakhstan',
        verified: true,
        total_certificates: 0,
        created_at: new Date().toISOString()
      };
      
      this.mockIssuers.push(newIssuer);
      return { data: newIssuer, error: null };
    }

    const { data, error } = await this.supabase
      .from('issuers')
      .insert([
        {
          wallet_address: issuerData.issuerPublicKey,
          name: issuerData.name || 'New Issuer',
          type: issuerData.type || 'Institution',
          country: 'Kazakhstan',
          verified: true,
          total_certificates: 0
        }
      ])
      .select();

    return { data, error };
  }

  async getIssuerByWallet(walletAddress) {
    if (!this.isConfigured) {
      const issuer = this.mockIssuers.find(i => i.wallet_address === walletAddress);
      return { data: issuer, error: issuer ? null : { message: 'Issuer not found' } };
    }

    const { data, error } = await this.supabase
      .from('issuers')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    return { data, error };
  }

  async getAllIssuers() {
    if (!this.isConfigured) {
      return { data: this.mockIssuers, error: null };
    }

    const { data, error } = await this.supabase
      .from('issuers')
      .select('*')
      .eq('verified', true);

    return { data, error };
  }

  async isAuthorizedIssuer(walletAddress) {
    if (!this.isConfigured) {
      return this.mockIssuers.some(i => i.wallet_address === walletAddress);
    }

    const { data, error } = await this.supabase
      .from('issuers')
      .select('id')
      .eq('wallet_address', walletAddress)
      .eq('verified', true)
      .single();

    return !error && !!data;
  }

  // Database setup (for initial Supabase setup)
  async setupTables() {
    if (!this.isConfigured) {
      console.log('Supabase not configured, skipping table setup');
      return;
    }

    console.log('Setting up Supabase tables...');
    
    // Note: In production, you'd typically use Supabase SQL editor or migrations
    // This is just for reference of the table structures needed
    const certificatesTableSQL = `
      CREATE TABLE IF NOT EXISTS certificates (
        id BIGSERIAL PRIMARY KEY,
        mint TEXT UNIQUE NOT NULL,
        student_name TEXT NOT NULL,
        course_name TEXT NOT NULL,
        issuer_name TEXT NOT NULL,
        issue_date TEXT NOT NULL,
        student_wallet TEXT NOT NULL,
        issuer_wallet TEXT NOT NULL,
        metadata_uri TEXT,
        verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const issuersTableSQL = `
      CREATE TABLE IF NOT EXISTS issuers (
        id BIGSERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        country TEXT DEFAULT 'Kazakhstan',
        verified BOOLEAN DEFAULT false,
        total_certificates INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log('Table schemas ready. Please create these tables in your Supabase SQL editor:');
    console.log('\n--- CERTIFICATES TABLE ---');
    console.log(certificatesTableSQL);
    console.log('\n--- ISSUERS TABLE ---');
    console.log(issuersTableSQL);
  }

  // Utility methods
  isConnected() {
    return this.isConfigured;
  }

  getStatus() {
    return {
      connected: this.isConfigured,
      mode: this.isConfigured ? 'supabase' : 'mock',
      certificateCount: this.isConfigured ? 'unknown' : this.mockCertificates.length,
      issuerCount: this.isConfigured ? 'unknown' : this.mockIssuers.length
    };
  }
}

module.exports = new SupabaseService();