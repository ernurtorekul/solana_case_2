const express = require('express');
const { PublicKey, Keypair } = require('@solana/web3.js');
const solanaService = require('../services/solana');
const ipfsService = require('../services/ipfs');
const supabaseService = require('../services/supabase');

const router = express.Router();

// Mint education certificate NFT
router.post('/mintCertificate', async (req, res) => {
  try {
    const {
      issuerPublicKey,
      studentPublicKey,
      studentName,
      courseName,
      issuerName
    } = req.body;

    // Validate required fields
    if (!issuerPublicKey || !studentPublicKey || !studentName || !courseName || !issuerName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['issuerPublicKey', 'studentPublicKey', 'studentName', 'courseName', 'issuerName']
      });
    }

    // Verify issuer is authorized - allow demo wallets
    if (!issuerPublicKey || issuerPublicKey.length < 20) {
      return res.status(400).json({
        error: 'Invalid issuer public key',
        message: 'Please provide a valid wallet address'
      });
    }
    
    // For demo mode, skip strict PublicKey validation
    if (!solanaService.isAuthorizedIssuer({ toString: () => issuerPublicKey })) {
      return res.status(403).json({
        error: 'Unauthorized issuer',
        message: 'This wallet address is not authorized to issue certificates'
      });
    }

    // Create and upload metadata to IPFS
    const date = new Date().toISOString().split('T')[0];
    const metadata = ipfsService.createCertificateMetadata(
      studentName,
      courseName,
      issuerName,
      date
    );

    const metadataUri = await ipfsService.uploadJSON(
      metadata,
      `${studentName}_${courseName}_Certificate`
    );

    // Generate new mint keypair for the NFT
    const mintKeypair = Keypair.generate();

    // Mock transaction for demo (in production, would call actual Solana program)
    const signature = await simulateCertificateMinting({
      mintKeypair,
      issuerPubkey: issuerPublicKey,
      studentPublicKey: studentPublicKey,
      metadata,
      metadataUri
    });

    // Add certificate to our database so it appears in verification
    const newCertificate = {
      mint: mintKeypair.publicKey.toString(),
      studentName,
      courseName,
      issuerName,
      date,
      student: studentPublicKey,
      issuer: issuerPublicKey,
      metadataUri,
      verified: true
    };
    
    await supabaseService.createCertificate(newCertificate);

    res.json({
      success: true,
      message: 'Certificate minted successfully',
      data: {
        signature,
        mint: mintKeypair.publicKey.toString(),
        metadataUri,
        certificate: {
          studentName,
          courseName,
          issuerName,
          date,
          student: studentPublicKey,
          issuer: issuerPublicKey
        }
      }
    });

  } catch (error) {
    console.error('Certificate minting error:', error);
    res.status(500).json({
      error: 'Failed to mint certificate',
      message: error.message
    });
  }
});

// Add issuer to whitelist (admin only)
router.post('/addIssuer', async (req, res) => {
  try {
    const { issuerPublicKey, adminPublicKey } = req.body;

    if (!issuerPublicKey || !adminPublicKey) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['issuerPublicKey', 'adminPublicKey']
      });
    }

    // In production, verify admin signature
    // For demo, we'll allow any request
    
    // Validate issuer public key - allow demo wallets
    if (!issuerPublicKey || issuerPublicKey.length < 20) {
      return res.status(400).json({
        error: 'Invalid issuer public key',
        message: 'Please provide a valid wallet address'
      });
    }
    
    solanaService.addAuthorizedIssuer({ toString: () => issuerPublicKey });

    res.json({
      success: true,
      message: 'Issuer added successfully',
      issuer: issuerPublicKey
    });

  } catch (error) {
    console.error('Add issuer error:', error);
    res.status(500).json({
      error: 'Failed to add issuer',
      message: error.message
    });
  }
});

// Get authorized issuers with details
router.get('/authorized', async (req, res) => {
  try {
    // In production, this would be stored in the blockchain program state
    const issuerRegistry = {
      'Demo1111111111111111111111111111111111': {
        name: 'Dulaty University',
        type: 'University',
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 150
      },
      'NU11111111111111111111111111111111111111': {
        name: 'Nazarbayev University',
        type: 'University', 
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 2547
      },
      'KNU1111111111111111111111111111111111111': {
        name: 'Al-Farabi Kazakh National University',
        type: 'University',
        country: 'Kazakhstan', 
        verified: true,
        totalCertificates: 5234
      },
      'AITU111111111111111111111111111111111111': {
        name: 'Astana IT University',
        type: 'Technical University',
        country: 'Kazakhstan',
        verified: true, 
        totalCertificates: 892
      },
      'Kaspi11111111111111111111111111111111111': {
        name: 'Kaspi.kz Academy',
        type: 'Corporate Training',
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 1205
      },
      'KMG1111111111111111111111111111111111111': {
        name: 'KazMunayGas Corporate Institute',
        type: 'Corporate Training', 
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 734
      },
      'AstanaHub1111111111111111111111111111111': {
        name: 'Astana Hub',
        type: 'Startup Accelerator',
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 12456
      },
      'DigKZ1111111111111111111111111111111111': {
        name: 'NFactorial',
        type: 'Accelerator Program', 
        country: 'Kazakhstan',
        verified: true,
        totalCertificates: 856
      }
    };

    const authorizedIssuers = Array.from(solanaService.authorizedIssuers)
      .map(address => ({
        address,
        ...issuerRegistry[address] || {
          name: 'Unknown Issuer',
          type: 'Unknown',
          country: 'Kazakhstan',
          verified: false,
          totalCertificates: 0
        }
      }));

    res.json({
      success: true,
      issuers: authorizedIssuers,
      total: authorizedIssuers.length,
      summary: {
        universities: authorizedIssuers.filter(i => i.type.includes('University')).length,
        corporateTraining: authorizedIssuers.filter(i => i.type === 'Corporate Training').length,
        government: authorizedIssuers.filter(i => i.type === 'Government Agency').length,
        totalCertificatesIssued: authorizedIssuers.reduce((sum, i) => sum + i.totalCertificates, 0)
      }
    });

  } catch (error) {
    console.error('Get authorized issuers error:', error);
    res.status(500).json({
      error: 'Failed to get authorized issuers',
      message: error.message
    });
  }
});

// Check if wallet is authorized issuer
router.get('/check/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    
    // Validate public key - allow demo wallets
    if (!publicKey || publicKey.length < 20) {
      return res.status(400).json({
        error: 'Invalid public key',
        message: 'Please provide a valid wallet address'
      });
    }
    
    // For demo mode, skip strict PublicKey validation
    // In production, you would validate with: new PublicKey(publicKey);
    const isAuthorized = solanaService.isAuthorizedIssuer({ toString: () => publicKey });

    res.json({
      success: true,
      publicKey,
      isAuthorized
    });

  } catch (error) {
    console.error('Check issuer error:', error);
    res.status(500).json({
      error: 'Failed to check issuer status',
      message: error.message
    });
  }
});

// Real blockchain certificate minting endpoint
router.post('/mintCertificateReal', async (req, res) => {
  try {
    const {
      issuerPrivateKey,
      studentPublicKey,
      studentName,
      courseName,
      issuerName
    } = req.body;

    // Validate required fields
    if (!issuerPrivateKey || !studentPublicKey || !studentName || !courseName || !issuerName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['issuerPrivateKey', 'studentPublicKey', 'studentName', 'courseName', 'issuerName']
      });
    }

    console.log('🚀 Starting real blockchain certificate minting...');

    // Create and upload metadata to IPFS
    const date = new Date().toISOString().split('T')[0];
    const metadata = ipfsService.createCertificateMetadata(
      studentName,
      courseName,
      issuerName,
      date
    );

    const metadataUri = await ipfsService.uploadJSON(
      metadata,
      `${studentName}_${courseName}_Certificate`
    );

    console.log('📄 Metadata uploaded to IPFS:', metadataUri);

    // Mint real NFT on Solana blockchain
    const result = await solanaService.mintCertificateNFT(
      studentPublicKey,
      issuerPrivateKey,
      metadata
    );

    console.log('✅ Real blockchain certificate minted!', result);

    // Store certificate in database
    const newCertificate = {
      mint: result.mint,
      studentName,
      courseName,
      issuerName,
      date,
      student: studentPublicKey,
      issuer: issuerPrivateKey, // In production, store public key only
      metadataUri,
      verified: true
    };
    
    await supabaseService.createCertificate(newCertificate);

    res.json({
      success: true,
      message: 'Certificate minted on blockchain successfully!',
      data: {
        signature: result.signature,
        mint: result.mint,
        tokenAccount: result.tokenAccount,
        metadataUri,
        certificate: {
          studentName,
          courseName,
          issuerName,
          date,
          student: studentPublicKey
        },
        blockchain: {
          network: 'devnet',
          explorer: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
        }
      }
    });

  } catch (error) {
    console.error('❌ Real certificate minting error:', error);
    res.status(500).json({
      error: 'Failed to mint certificate on blockchain',
      message: error.message
    });
  }
});

// Get Solana network status
router.get('/network-status', async (req, res) => {
  try {
    const status = await solanaService.getConnectionStatus();
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get network status',
      message: error.message
    });
  }
});

// Airdrop SOL to wallet (devnet only)
router.post('/airdrop', async (req, res) => {
  try {
    const { publicKey, amount = 1 } = req.body;

    if (!publicKey) {
      return res.status(400).json({
        error: 'Missing publicKey',
        message: 'Please provide a wallet address'
      });
    }

    const result = await solanaService.airdropSOL(publicKey, amount);
    
    res.json({
      success: true,
      message: `Airdropped ${amount} SOL to wallet`,
      data: {
        signature: result.signature,
        amount: result.amount,
        publicKey,
        explorer: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
      }
    });

  } catch (error) {
    console.error('Airdrop error:', error);
    res.status(500).json({
      error: 'Failed to airdrop SOL',
      message: error.message
    });
  }
});

// Check wallet balance
router.get('/balance/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    
    if (!publicKey) {
      return res.status(400).json({
        error: 'Missing publicKey',
        message: 'Please provide a wallet address'
      });
    }

    const balance = await solanaService.getAccountBalance(publicKey);
    
    res.json({
      success: true,
      publicKey,
      balance,
      balanceSOL: `${balance} SOL`
    });

  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({
      error: 'Failed to check balance',
      message: error.message
    });
  }
});

// Mock certificate minting simulation
async function simulateCertificateMinting({ mintKeypair, issuerPubkey, studentPublicKey, metadata, metadataUri }) {
  // In production, this would call the actual Solana program
  console.log('Simulating certificate minting...');
  console.log('Mint:', mintKeypair.publicKey.toString());
  console.log('Issuer:', issuerPubkey);
  console.log('Student:', studentPublicKey);
  console.log('Metadata URI:', metadataUri);

  // Return mock transaction signature
  return '5VGxBMTsBUgMF3FbhjbQYCtKL6UDJdHhAD6F7M4R1Q2k9X9nP8Wj7wZqBvLt3CxD5Fy2Y8GmH4J6K7LqNr1P';
}

module.exports = router;