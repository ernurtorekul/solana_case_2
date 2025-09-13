const express = require('express');
const { PublicKey, Keypair } = require('@solana/web3.js');
const solanaService = require('../services/solana');
const ipfsService = require('../services/ipfs');

const router = express.Router();

// Mock property database
const mockProperties = [
  {
    id: 'prop_1',
    mint: 'PropMint111111111111111111111111111111',
    name: 'Almaty Towers - Unit 205',
    totalValue: 100000,
    totalTokens: 1000,
    tokensSold: 250,
    pricePerToken: 100,
    location: 'Almaty, Kazakhstan',
    description: 'Luxury apartment in the heart of Almaty with stunning city views',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    metadataUri: 'https://gateway.pinata.cloud/ipfs/QmMockPropertyHash123',
    monthlyRent: 2500,
    annualReturn: 12.5,
    status: 'active',
    created: '2024-11-01'
  },
  {
    id: 'prop_2',
    mint: 'PropMint222222222222222222222222222222',
    name: 'Astana Business Center - Office 1204',
    totalValue: 150000,
    totalTokens: 1500,
    tokensSold: 450,
    pricePerToken: 100,
    location: 'Nur-Sultan, Kazakhstan',
    description: 'Prime office space in the central business district',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    metadataUri: 'https://gateway.pinata.cloud/ipfs/QmMockPropertyHash456',
    monthlyRent: 3750,
    annualReturn: 15.0,
    status: 'active',
    created: '2024-10-15'
  }
];

// Get all available properties
router.get('/info', async (req, res) => {
  try {
    const properties = mockProperties.map(property => ({
      ...property,
      tokensAvailable: property.totalTokens - property.tokensSold,
      ownershipSold: ((property.tokensSold / property.totalTokens) * 100).toFixed(1)
    }));

    res.json({
      success: true,
      properties,
      total: properties.length
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      error: 'Failed to fetch properties',
      message: error.message
    });
  }
});

// Get specific property details
router.get('/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = mockProperties.find(p => p.id === propertyId || p.mint === propertyId);

    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        message: 'No property found with this ID'
      });
    }

    res.json({
      success: true,
      property: {
        ...property,
        tokensAvailable: property.totalTokens - property.tokensSold,
        ownershipSold: ((property.tokensSold / property.totalTokens) * 100).toFixed(1)
      }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      error: 'Failed to fetch property',
      message: error.message
    });
  }
});

// Buy property tokens
router.post('/buy', async (req, res) => {
  try {
    const { buyerPublicKey, propertyId, tokenAmount } = req.body;

    // Validate required fields
    if (!buyerPublicKey || !propertyId || !tokenAmount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['buyerPublicKey', 'propertyId', 'tokenAmount']
      });
    }

    // Validate buyer public key - allow demo wallets
    if (!buyerPublicKey || buyerPublicKey.length < 20) {
      return res.status(400).json({
        error: 'Invalid buyer public key',
        message: 'Please provide a valid Solana wallet address'
      });
    }
    
    // For demo mode, skip strict PublicKey validation
    // In production, you would validate with: new PublicKey(buyerPublicKey);

    // Find property
    const property = mockProperties.find(p => p.id === propertyId || p.mint === propertyId);
    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        message: 'No property found with this ID'
      });
    }

    // Check token availability
    const tokensAvailable = property.totalTokens - property.tokensSold;
    if (tokenAmount > tokensAvailable) {
      return res.status(400).json({
        error: 'Insufficient tokens available',
        message: `Only ${tokensAvailable} tokens available, requested: ${tokenAmount}`
      });
    }

    // Validate token amount
    if (tokenAmount <= 0 || !Number.isInteger(tokenAmount)) {
      return res.status(400).json({
        error: 'Invalid token amount',
        message: 'Token amount must be a positive integer'
      });
    }

    // Calculate total cost
    const totalCost = tokenAmount * property.pricePerToken;

    // Mock transaction for demo (in production, would call actual Solana program)
    const signature = await simulateTokenPurchase({
      buyerPublicKey: buyerPublicKey, // Pass as string for demo
      property,
      tokenAmount,
      totalCost
    });

    // Update property tokens sold (in production, this would be handled by the blockchain)
    property.tokensSold += tokenAmount;

    res.json({
      success: true,
      message: 'Property tokens purchased successfully',
      data: {
        signature,
        buyer: buyerPublicKey,
        property: {
          id: property.id,
          name: property.name,
          mint: property.mint
        },
        purchase: {
          tokenAmount,
          pricePerToken: property.pricePerToken,
          totalCost,
          ownershipPercentage: ((tokenAmount / property.totalTokens) * 100).toFixed(2)
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Buy property tokens error:', error);
    res.status(500).json({
      error: 'Failed to purchase property tokens',
      message: error.message
    });
  }
});

// Claim rent for property tokens
router.post('/claim-rent', async (req, res) => {
  try {
    const { userPublicKey, propertyId } = req.body;

    // Validate required fields
    if (!userPublicKey || !propertyId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['userPublicKey', 'propertyId']
      });
    }

    // Validate user public key - allow demo wallets  
    if (!userPublicKey || userPublicKey.length < 20) {
      return res.status(400).json({
        error: 'Invalid user public key',
        message: 'Please provide a valid Solana wallet address'
      });
    }

    // Find property
    const property = mockProperties.find(p => p.id === propertyId || p.mint === propertyId);
    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        message: 'No property found with this ID'
      });
    }

    // Mock user token balance (in production, fetch from blockchain)
    const userTokenBalance = 50; // Demo: user owns 50 tokens
    
    if (userTokenBalance <= 0) {
      return res.status(400).json({
        error: 'No tokens owned',
        message: 'You must own property tokens to claim rent'
      });
    }

    // Calculate rent share
    const ownershipPercentage = (userTokenBalance / property.totalTokens) * 100;
    const monthlyRent = property.monthlyRent;
    const userRentShare = (monthlyRent * userTokenBalance) / property.totalTokens;

    // Mock transaction for demo
    const signature = await simulateRentClaim({
      userPublicKey: userPublicKey, // Pass as string for demo
      property,
      userTokenBalance,
      rentAmount: userRentShare
    });

    res.json({
      success: true,
      message: 'Rent claimed successfully',
      data: {
        signature,
        user: userPublicKey,
        property: {
          id: property.id,
          name: property.name,
          mint: property.mint
        },
        claim: {
          tokensOwned: userTokenBalance,
          ownershipPercentage: ownershipPercentage.toFixed(2),
          monthlyRent: monthlyRent,
          rentShare: userRentShare.toFixed(2),
          currency: 'USD'
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Claim rent error:', error);
    res.status(500).json({
      error: 'Failed to claim rent',
      message: error.message
    });
  }
});

// Get user property holdings
router.get('/holdings/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;

    // Validate wallet address - allow demo wallets
    if (!wallet || wallet.length < 20) {
      return res.status(400).json({
        error: 'Invalid wallet address',
        message: 'Please provide a valid Solana wallet address'
      });
    }

    // Mock user holdings (in production, fetch from blockchain)
    const userHoldings = [
      {
        property: mockProperties[0],
        tokensOwned: 50,
        ownershipPercentage: 5.0,
        currentValue: 5000,
        monthlyRentShare: 125,
        purchaseDate: '2024-11-10'
      }
    ];

    const totalValue = userHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalMonthlyRent = userHoldings.reduce((sum, holding) => sum + holding.monthlyRentShare, 0);

    res.json({
      success: true,
      wallet,
      summary: {
        totalProperties: userHoldings.length,
        totalValue,
        totalMonthlyRent,
        averageReturn: userHoldings.length > 0 
          ? ((totalMonthlyRent * 12 / totalValue) * 100).toFixed(2)
          : 0
      },
      holdings: userHoldings
    });

  } catch (error) {
    console.error('Get property holdings error:', error);
    res.status(500).json({
      error: 'Failed to fetch property holdings',
      message: error.message
    });
  }
});

// Mock transaction simulators
async function simulateTokenPurchase({ buyerPublicKey, property, tokenAmount, totalCost }) {
  console.log('Simulating property token purchase...');
  console.log('Buyer:', buyerPublicKey);
  console.log('Property:', property.name);
  console.log('Tokens:', tokenAmount);
  console.log('Cost:', totalCost);

  return '5PropertyTokensPurchase123456789ABCDEF';
}

async function simulateRentClaim({ userPublicKey, property, userTokenBalance, rentAmount }) {
  console.log('Simulating rent claim...');
  console.log('User:', userPublicKey);
  console.log('Property:', property.name);
  console.log('Tokens owned:', userTokenBalance);
  console.log('Rent amount:', rentAmount);

  return '5RentClaim123456789ABCDEF';
}

module.exports = router;