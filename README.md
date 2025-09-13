## about the project
   A modular citizen platform designed as the missing trust layer for Kazakhstan's government digital systems like Egov and financial super-apps like Kaspi. This project demonstrates how blockchain technology can enhance transparency, reduce bureaucracy, and make Kazakhstan globally competitive in the digital economy.

   The National Tokenization Hub serves as a blockchain registry where citizens' skills, assets, and achievements are secured transparently. For this hackathon MVP, we've implemented two core modules:

### Education Certificates (NFTs)
- **Issuers**: Universities and companies mint NFT-based certificates
- **Students**: Receive tamper-proof credentials in their wallets
- **Verifiers**: Instantly verify authenticity without contacting issuers
- **Metadata**: Stored on IPFS with complete certificate details

### Real Estate Tokenization
- **Fractional Ownership**: Properties split into fungible SPL tokens
- **Affordable Investment**: Start investing with as little as $100
- **Rent Distribution**: Automated monthly rent payouts to token holders
- **Transparent Trading**: All transactions recorded on Solana blockchain

## 🛠 Tech Stack

- **Frontend**: React.js with Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js with REST API
- **Blockchain**: Solana + Anchor framework
- **Storage**: IPFS (Pinata) for NFT metadata
- **Wallet**: Phantom wallet integration



## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ 
- Solana CLI (optional for local development)
- Anchor framework (optional)
- Phantom wallet browser extension

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd solana_case_2
   npm run setup  # Installs all dependencies
   ```

2. **Environment Configuration**
   
   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   SOLANA_RPC_URL=http://localhost:8899
   SOLANA_NETWORK=localnet
   PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_API_KEY=your_pinata_secret_key
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_SOLANA_NETWORK=localnet
   NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
   ```

3. **Start Development Servers**
   ```bash
   npm run dev  # Starts all services concurrently
   ```

   Or individually:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend  
   cd frontend && npm run dev

   # Terminal 3: Solana local validator (optional)
   solana-test-validator
   ```

### 🌐 Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 📚 API Endpoints

### Certificate Management
- `POST /api/issuer/mintCertificate` - Mint education certificate NFT
- `GET /api/user/certificates/:wallet` - Get user's certificates
- `GET /api/user/verify/:wallet` - Verify certificate authenticity
- `POST /api/issuer/addIssuer` - Add authorized issuer (admin)
- `GET /api/issuer/check/:publicKey` - Check issuer authorization

### Property Tokenization
- `GET /api/property/info` - List all available properties
- `GET /api/property/:propertyId` - Get specific property details
- `POST /api/property/buy` - Purchase property tokens
- `POST /api/property/claim-rent` - Claim monthly rent distribution
- `GET /api/property/holdings/:wallet` - Get user's property holdings

### User Dashboard
- `GET /api/user/dashboard/:wallet` - Complete user dashboard data

## 🎮 Demo Usage

### 1. Connect Wallet
- Open http://localhost:3000
- Click "Connect Wallet" (uses demo wallet if Phantom not available)

### 2. Issue Certificate (Issuer Role)
- Navigate to "Issuer" page
- Fill certificate details:
  - Student wallet: `Student111111111111111111111111111111`
  - Student name: `Aidar Nazarbayev`
  - Course: `Blockchain Development`
  - Issuer: `Nazarbayev University`
- Click "Mint Certificate"

### 3. Verify Certificates
- Navigate to "Verify" page
- Enter wallet address to verify: `Student111111111111111111111111111111`
- View verified certificates with full details

### 4. Real Estate Investment
- Navigate to "Properties" page (or click "Browse Properties" from Dashboard)
- Select a property (e.g., "Almaty Towers - Unit 205")
- Choose number of tokens to purchase
- Complete purchase transaction
- View holdings in Dashboard
- Claim monthly rent distribution

### 5. Dashboard Overview
- Navigate to "Dashboard" page
- Switch between "My Certificates" and "Real Estate" tabs
- View portfolio statistics and monthly income

## 🔧 Development Features

### Mock Data & Demo Mode
- Pre-loaded demo certificates and properties
- Simulated blockchain transactions for hackathon demo
- Mock wallet addresses for testing verification
- IPFS placeholder URLs for metadata

### Wallet Integration
- Phantom wallet support
- Fallback demo wallet for testing
- Persistent wallet connection state

### Responsive Design
- Mobile-first Tailwind CSS design
- Accessible components with proper ARIA labels
- Toast notifications for user feedback

## 🏗 Architecture Highlights

### Anchor Program Structure
```rust
// Main program modules
- initialize_platform()     // Setup platform with admin
- add_issuer()             // Whitelist certificate issuers  
- mint_certificate()       // Create education NFTs
- initialize_property()    // Setup property tokenization
- buy_property_tokens()    // Purchase fractional ownership
- claim_rent()            // Distribute monthly rent
```

### Frontend Architecture
```typescript
// Key components
- WalletProvider          // Solana wallet integration
- Navbar                 // Navigation with wallet status
- Dashboard              // User portfolio overview
- IssuerPage            // Certificate minting interface
- VerifyPage            // Certificate verification
- PropertiesPage        // Real estate investment
```

### Backend Services
```javascript
// Core services
- SolanaService         // Blockchain interaction
- IPFSService          // Metadata storage
- Certificate routes   // NFT management APIs
- Property routes      // Tokenization APIs
- User routes         // Dashboard data
```

## 🌟 Key Features Demonstrated

### ✅ Education Certificates
- [x] NFT-based certificate minting
- [x] IPFS metadata storage
- [x] Issuer authorization system
- [x] Instant verification without issuer contact
- [x] Tamper-proof credential storage

### ✅ Real Estate Tokenization
- [x] Property fractional ownership
- [x] SPL token-based shares
- [x] Automated rent distribution simulation
- [x] Portfolio tracking and management
- [x] Real-time ownership percentages

### ✅ Platform Features
- [x] Multi-role user interface (Citizen/Issuer/Verifier)
- [x] Responsive web design
- [x] Wallet integration (Phantom)
- [x] Real-time transaction feedback
- [x] IPFS integration for decentralized storage

## 🎯 Future Enhancements

### Phase 2 Features
- [ ] Integration with Solflare and other wallets
- [ ] Real Anchor program deployment
- [ ] Secondary market for property tokens
- [ ] Advanced certificate templates
- [ ] Multi-language support (Kazakh/Russian/English)

### Kazakhstan Integration
- [ ] Egov API integration
- [ ] Kaspi Pay integration
- [ ] KYC/AML compliance
- [ ] Government issuer verification
- [ ] Real property data sources

### Advanced Features
- [ ] DAO governance for platform decisions
- [ ] Staking rewards for long-term holders
- [ ] Cross-chain bridge to other blockchains
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the robust blockchain infrastructure
- **Anchor Framework** for simplified Solana program development
- **Phantom Wallet** for seamless wallet integration
- **IPFS/Pinata** for decentralized metadata storage
- **Kazakhstan Government** for inspiring digital transformation initiatives

## 📞 Contact

For questions about this hackathon project:
- Email: [your-email@example.com]
- Telegram: [@your-username]
- GitHub: [@your-github-username]

---

**Built with ❤️ for Kazakhstan's Digital Future**

*Empowering citizens through blockchain transparency and financial inclusion*