const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const { 
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const { AnchorProvider, Program, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');

class SolanaService {
  constructor() {
    try {
      this.connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899');
      this.programId = new PublicKey(process.env.PROGRAM_ID);
      
      // Load platform keypair (create dummy one for demo)
      this.platformKeypair = this.loadOrCreatePlatformKeypair();
      this.wallet = new Wallet(this.platformKeypair);
      this.provider = new AnchorProvider(this.connection, this.wallet, {
        commitment: 'confirmed'
      });
      
      // Initialize program (IDL would be loaded from generated types in production)
      this.program = this.createProgramInterface();
    } catch (error) {
      console.log('Running in demo mode without Solana connection');
      // Create minimal setup for demo
      this.platformKeypair = Keypair.generate();
      this.program = this.createProgramInterface();
    }
    
    // Authorized issuers whitelist (in production, this would be in the program state)
    this.authorizedIssuers = new Set([
      'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS', // Demo issuer
      'Demo1111111111111111111111111111111111', // Dulaty University
      // Universities
      'NU11111111111111111111111111111111111111', // Nazarbayev University
      'KNU1111111111111111111111111111111111111', // Kazakh National University
      'AITU111111111111111111111111111111111111', // Astana IT University
      // Corporate Training
      'Kaspi11111111111111111111111111111111111', // Kaspi.kz Academy
      'KMG1111111111111111111111111111111111111', // KazMunayGas Institute
      // Government
      'AstanaHub1111111111111111111111111111111', // Ministry of Education
      'DigKZ1111111111111111111111111111111111', // Digital Kazakhstan
    ]);
  }

  loadOrCreatePlatformKeypair() {
    const keypairPath = process.env.PLATFORM_KEYPAIR_PATH || './keys/platform.json';
    
    try {
      if (fs.existsSync(keypairPath)) {
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
        return Keypair.fromSecretKey(new Uint8Array(keypairData));
      }
    } catch (error) {
      console.log('Creating new platform keypair...');
    }
    
    // Create new keypair for demo
    const keypair = Keypair.generate();
    
    // Ensure directory exists
    const dir = keypairPath.substring(0, keypairPath.lastIndexOf('/'));
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save keypair
    fs.writeFileSync(
      keypairPath, 
      JSON.stringify(Array.from(keypair.secretKey))
    );
    
    return keypair;
  }

  createProgramInterface() {
    // Simplified program interface for demo purposes
    // In production, this would use the generated IDL
    return {
      account: {
        platform: {
          fetch: async (address) => {
            // Mock platform account
            return {
              authority: this.platformKeypair.publicKey,
              totalProperties: 1,
              totalCertificates: 0,
              authorizedIssuers: Array.from(this.authorizedIssuers).map(key => new PublicKey(key))
            };
          }
        },
        certificate: {
          all: async () => {
            // Mock certificates - in production would fetch from blockchain
            return [];
          }
        },
        property: {
          all: async () => {
            // Mock properties - in production would fetch from blockchain
            return [{
              publicKey: new PublicKey('11111111111111111111111111111111'),
              account: {
                name: "Almaty Towers - Unit 205",
                totalValue: 100000,
                totalTokens: 1000,
                tokensSold: 250,
                metadataUri: "https://example.com/property1.json",
                mint: new PublicKey('11111111111111111111111111111111')
              }
            }];
          },
          fetch: async (address) => {
            return {
              name: "Almaty Towers - Unit 205",
              totalValue: 100000,
              totalTokens: 1000,
              tokensSold: 250,
              metadataUri: "https://example.com/property1.json",
              mint: new PublicKey('11111111111111111111111111111111')
            };
          }
        }
      },
      methods: {
        mintCertificate: () => ({
          accounts: (accounts) => ({
            rpc: async () => {
              // Mock transaction signature
              return '5VGxBMTsBUgMF3FbhjbQYCtKL6UDJdHhAD6F7M4R1Q2k9X9nP8Wj7wZqBvLt3CxD5Fy2Y8GmH4J6K7LqNr1P';
            }
          })
        }),
        buyPropertyTokens: () => ({
          accounts: (accounts) => ({
            rpc: async () => {
              return '5VGxBMTsBUgMF3FbhjbQYCtKL6UDJdHhAD6F7M4R1Q2k9X9nP8Wj7wZqBvLt3CxD5Fy2Y8GmH4J6K7LqNr1P';
            }
          })
        })
      }
    };
  }

  async getPlatformAddress() {
    const [platformPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('platform')],
      this.programId
    );
    return platformPda;
  }

  async getCertificateAddress(mint) {
    const [certificatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('certificate'), mint.toBuffer()],
      this.programId
    );
    return certificatePda;
  }

  async getPropertyAddress(mint) {
    const [propertyPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('property'), mint.toBuffer()],
      this.programId
    );
    return propertyPda;
  }

  isAuthorizedIssuer(publicKey) {
    return this.authorizedIssuers.has(publicKey.toString());
  }

  addAuthorizedIssuer(publicKey) {
    this.authorizedIssuers.add(publicKey.toString());
  }

  // Real blockchain functions
  async mintCertificateNFT(studentPublicKey, issuerPrivateKey, metadata) {
    try {
      console.log('🚀 Starting real certificate NFT minting...');
      
      // Convert keys to proper types
      const studentPubkey = new PublicKey(studentPublicKey);
      const issuerKeypair = Keypair.fromSecretKey(new Uint8Array(issuerPrivateKey));
      
      console.log('Student:', studentPubkey.toString());
      console.log('Issuer:', issuerKeypair.publicKey.toString());
      
      // Create a new mint for the certificate NFT
      const mintKeypair = Keypair.generate();
      console.log('Creating mint:', mintKeypair.publicKey.toString());
      
      const mint = await createMint(
        this.connection,
        issuerKeypair, // Payer
        issuerKeypair.publicKey, // Mint authority 
        null, // No freeze authority for certificates
        0, // 0 decimals for NFT
        mintKeypair // Mint keypair
      );
      
      console.log('✅ Mint created:', mint.toString());
      
      // Get or create associated token account for the student
      console.log('📦 Creating associated token account...');
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        issuerKeypair, // Payer (issuer pays for account creation)
        mint,
        studentPubkey, // Owner (student owns the account)
        false // allowOwnerOffCurve
      );
      
      console.log('✅ Token account created:', tokenAccount.address.toString());
      
      // Mint 1 NFT to the student
      console.log('🎯 Minting NFT to student...');
      const signature = await mintTo(
        this.connection,
        issuerKeypair, // Payer 
        mint,
        tokenAccount.address,
        issuerKeypair.publicKey, // Mint authority
        1 // Amount (1 NFT)
      );
      
      console.log('✅ NFT minted! Transaction signature:', signature);
      
      return {
        signature,
        mint: mint.toString(),
        tokenAccount: tokenAccount.address.toString(),
        success: true
      };
      
    } catch (error) {
      console.error('❌ Error minting certificate NFT:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  }

  async getAccountBalance(publicKey) {
    try {
      const pubkey = new PublicKey(publicKey);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  async airdropSOL(publicKey, amount = 1) {
    try {
      const pubkey = new PublicKey(publicKey);
      const signature = await this.connection.requestAirdrop(
        pubkey,
        amount * LAMPORTS_PER_SOL
      );
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature);
      
      return {
        signature,
        amount,
        success: true
      };
    } catch (error) {
      console.error('Error airdropping SOL:', error);
      throw error;
    }
  }

  async transferSOL(fromKeypair, toPublicKey, amount) {
    try {
      const fromKey = Keypair.fromSecretKey(new Uint8Array(fromKeypair));
      const toPubkey = new PublicKey(toPublicKey);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKey.publicKey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKey]
      );
      
      return {
        signature,
        amount,
        success: true
      };
    } catch (error) {
      console.error('Error transferring SOL:', error);
      throw error;
    }
  }

  // Get connection status
  async getConnectionStatus() {
    try {
      // Test connection by getting slot and version
      const slot = await this.connection.getSlot();
      const version = await this.connection.getVersion();
      
      return {
        connected: true,
        network: process.env.SOLANA_NETWORK || 'devnet',
        rpcUrl: process.env.SOLANA_RPC_URL,
        currentSlot: slot,
        version: version['solana-core'],
        cluster: version['feature-set'] ? 'mainnet' : 'devnet'
      };
    } catch (error) {
      return {
        connected: false,
        network: process.env.SOLANA_NETWORK || 'devnet',
        rpcUrl: process.env.SOLANA_RPC_URL,
        error: error.message
      };
    }
  }
}

module.exports = new SolanaService();