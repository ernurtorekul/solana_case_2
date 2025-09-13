const express = require('express');
const { PublicKey } = require('@solana/web3.js');
const supabaseService = require('../services/supabase');

const router = express.Router();

// Get all certificates owned by a wallet
router.get('/certificates/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    // Validate wallet address - allow demo wallets
    if (!wallet || wallet.length < 20) {
      return res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Solana wallet address'
      });
    }

    const { data: certificates, error } = await supabaseService.getCertificatesByWallet(wallet);
    
    if (error) {
      console.error('Get certificates error:', error);
      return res.status(500).json({
        error: 'Failed to fetch certificates',
        message: error.message
      });
    }

    // Convert Supabase format to API format
    const formattedCertificates = certificates.map(cert => ({
      mint: cert.mint,
      studentName: cert.student_name,
      courseName: cert.course_name,
      issuerName: cert.issuer_name,
      date: cert.issue_date,
      student: cert.student_wallet,
      issuer: cert.issuer_wallet,
      metadataUri: cert.metadata_uri,
      verified: cert.verified
    }));

    res.json({
      success: true,
      wallet,
      certificates: formattedCertificates,
      total: formattedCertificates.length
    });

  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({
      error: 'Failed to fetch certificates',
      message: error.message
    });
  }
});

// Get certificate details by mint address
router.get('/certificate/:mint', async (req, res) => {
  try {
    const { mint } = req.params;

    // Validate mint address
    try {
      new PublicKey(mint);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid mint address',
        message: 'Please provide a valid mint address'
      });
    }

    const { data: certificate, error } = await supabaseService.getCertificateByMint(mint);

    if (error || !certificate) {
      return res.status(404).json({
        error: 'Certificate not found',
        message: 'No certificate found with this mint address'
      });
    }

    // Convert Supabase format to API format
    const formattedCertificate = {
      mint: certificate.mint,
      studentName: certificate.student_name,
      courseName: certificate.course_name,
      issuerName: certificate.issuer_name,
      date: certificate.issue_date,
      student: certificate.student_wallet,
      issuer: certificate.issuer_wallet,
      metadataUri: certificate.metadata_uri,
      verified: certificate.verified
    };

    res.json({
      success: true,
      certificate: formattedCertificate
    });

  } catch (error) {
    console.error('Get certificate details error:', error);
    res.status(500).json({
      error: 'Failed to fetch certificate details',
      message: error.message
    });
  }
});

// Verify certificate authenticity
router.get('/verify/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    // Validate wallet address - allow demo wallets
    if (!wallet || wallet.length < 20) {
      return res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Solana wallet address'
      });
    }

    const { data: certificates, error } = await supabaseService.getVerifiedCertificates(wallet);

    if (error) {
      console.error('Verify certificates error:', error);
      return res.status(500).json({
        error: 'Failed to verify certificates',
        message: error.message
      });
    }

    // Convert Supabase format to API format
    const formattedCertificates = certificates.map(cert => ({
      mint: cert.mint,
      studentName: cert.student_name,
      courseName: cert.course_name,
      issuerName: cert.issuer_name,
      date: cert.issue_date,
      verified: cert.verified,
      metadataUri: cert.metadata_uri
    }));

    res.json({
      success: true,
      wallet,
      verified: formattedCertificates.length > 0,
      certificates: formattedCertificates,
      total: formattedCertificates.length,
      message: formattedCertificates.length > 0 
        ? 'Verified certificates found' 
        : 'No verified certificates found for this wallet'
    });

  } catch (error) {
    console.error('Verify certificates error:', error);
    res.status(500).json({
      error: 'Failed to verify certificates',
      message: error.message
    });
  }
});

// Get user dashboard stats
router.get('/dashboard/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    // Validate wallet address - allow demo wallets
    if (!wallet || wallet.length < 20) {
      return res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Solana wallet address'
      });
    }

    // Get user certificates
    const { data: certificates, error } = await supabaseService.getCertificatesByWallet(wallet);

    if (error) {
      console.error('Get dashboard error:', error);
      return res.status(500).json({
        error: 'Failed to fetch dashboard data',
        message: error.message
      });
    }

    // Convert certificates to expected format
    const formattedCertificates = certificates.map(cert => ({
      mint: cert.mint,
      studentName: cert.student_name,
      courseName: cert.course_name,
      issuerName: cert.issuer_name,
      date: cert.issue_date,
      student: cert.student_wallet,
      issuer: cert.issuer_wallet,
      metadataUri: cert.metadata_uri,
      verified: cert.verified
    }));

    // Mock property tokens (this could be another Supabase table in the future)
    const userPropertyTokens = [
      {
        propertyName: 'Almaty Towers - Unit 205',
        tokensOwned: 50,
        totalTokens: 1000,
        ownershipPercentage: 5.0,
        currentValue: 5000,
        monthlyRent: 25,
        mint: 'PropMint111111111111111111111111111111'
      }
    ];

    res.json({
      success: true,
      wallet,
      summary: {
        totalCertificates: formattedCertificates.length,
        totalProperties: userPropertyTokens.length,
        totalPropertyValue: userPropertyTokens.reduce((sum, prop) => sum + prop.currentValue, 0),
        monthlyRentIncome: userPropertyTokens.reduce((sum, prop) => sum + prop.monthlyRent, 0)
      },
      certificates: formattedCertificates,
      propertyTokens: userPropertyTokens
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

// Database status endpoint
router.get('/db-status', async (req, res) => {
  try {
    const status = supabaseService.getStatus();
    res.json({
      success: true,
      database: status
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get database status',
      message: error.message
    });
  }
});

module.exports = router;