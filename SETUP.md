# Setup Instructions for National Tokenization Hub

## 🎯 Overview
This guide will help you set up the National Tokenization Hub hackathon project locally. The platform includes a Solana blockchain program, Express.js backend, and Next.js frontend.

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

### Optional (for full blockchain development)
- **Solana CLI** ([Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor Framework** ([Installation Guide](https://www.anchor-lang.com/docs/installation))
- **Phantom Wallet** browser extension

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd solana_case_2
```

### 2. Install All Dependencies
```bash
npm run setup
```
This single command installs dependencies for all three components (blockchain, backend, frontend).

### 3. Configure Environment

**Backend Configuration** - Create `backend/.env`:
```env
PORT=3001
SOLANA_RPC_URL=http://localhost:8899
SOLANA_NETWORK=localnet
PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

**Frontend Configuration** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOLANA_NETWORK=localnet
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
```

### 4. Start Development Environment
```bash
npm run dev
```
This starts all services concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### 5. Open Application
- Navigate to http://localhost:3000
- Click "Connect Wallet" to start using the demo

## 🛠 Detailed Setup

### Individual Service Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
```

#### Blockchain Setup (Optional)
```bash
cd blockchain
npm install
# If you have Anchor installed:
anchor build
anchor test
```

## 🔧 Configuration Options

### Environment Variables

#### Backend (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Backend server port |
| `SOLANA_RPC_URL` | http://localhost:8899 | Solana RPC endpoint |
| `SOLANA_NETWORK` | localnet | Solana network |
| `PROGRAM_ID` | Fg6PaFpo... | Deployed program ID |
| `PINATA_API_KEY` | - | IPFS service API key |
| `PINATA_SECRET_API_KEY` | - | IPFS service secret |

#### Frontend (.env.local)
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:3001/api | Backend API URL |
| `NEXT_PUBLIC_SOLANA_NETWORK` | localnet | Solana network |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | http://localhost:8899 | Solana RPC URL |

### IPFS Configuration (Optional)

For production deployment, set up Pinata:
1. Create account at [Pinata](https://pinata.cloud/)
2. Generate API keys
3. Add keys to backend `.env` file

For development, the app uses mock IPFS URLs.

## 🌐 Network Setup

### Local Development (Recommended for Demo)
- Uses mock data and simulated transactions
- No blockchain setup required
- Perfect for hackathon demonstration

### Solana Localnet (Advanced)
```bash
# Start Solana local validator
solana-test-validator

# Deploy program (if using Anchor)
cd blockchain
anchor build
anchor deploy
```

### Devnet Deployment
```bash
# Configure for devnet
solana config set --url devnet

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## 🧪 Testing Setup

### Demo Data
The application includes pre-loaded demo data:
- **Demo Certificates**: 2 sample education certificates
- **Demo Properties**: 2 tokenized real estate properties  
- **Demo Wallets**: Test addresses for verification

### Test Wallet Addresses
- `Student111111111111111111111111111111` - Has certificates
- `Student222222222222222222222222222222` - Has certificates
- `EmptyWallet11111111111111111111111111` - No certificates

### Demo Flow
1. Connect wallet (uses demo wallet if Phantom unavailable)
2. Navigate to "Verify" → Enter demo wallet addresses
3. Navigate to "Properties" → Purchase tokens
4. Navigate to "Dashboard" → View portfolio
5. Navigate to "Issuer" → Mint new certificates (if authorized)

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes on ports 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Wallet Connection Issues
- Install Phantom wallet extension
- Allow connection when prompted
- App will use demo wallet as fallback

#### API Connection Issues
- Verify backend is running on port 3001
- Check console for CORS errors
- Ensure `.env` files are properly configured

### Environment Issues

#### Windows Users
```bash
# Use npm scripts instead of direct commands
npm run dev:backend
npm run dev:frontend
```

#### Node Version Issues
```bash
# Check Node version
node --version

# Should be 18+ for best compatibility
nvm use 18  # if using nvm
```

## 📱 Wallet Setup

### Phantom Wallet (Recommended)
1. Install [Phantom Wallet](https://phantom.app/) browser extension
2. Create or import wallet
3. Switch to "Devnet" in wallet settings
4. Connect when prompted by application

### Demo Mode
If no wallet detected, app automatically uses demo wallet addresses for testing.

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy build folder to hosting service
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Set environment variables on hosting platform
# Deploy with npm start command
```

### Solana Program Deployment
```bash
cd blockchain
anchor build
anchor deploy --provider.cluster devnet
# Update PROGRAM_ID in backend/.env
```

## 📊 Health Checks

After setup, verify all services:

1. **Backend Health**: http://localhost:3001/health
2. **Frontend**: http://localhost:3000
3. **API Test**: 
   ```bash
   curl http://localhost:3001/api/property/info
   ```

## 🎯 Demo Checklist

Before demonstrating:
- [ ] All services running (frontend + backend)
- [ ] Demo wallets have certificates
- [ ] Properties show available tokens
- [ ] Wallet connection works
- [ ] All major features functional

## 💡 Tips for Success

1. **Use Demo Mode**: Perfect for hackathon demos without blockchain complexity
2. **Mock Data**: Pre-loaded demo data makes demonstrations smooth
3. **Error Handling**: Application includes user-friendly error messages
4. **Responsive Design**: Works on desktop and mobile
5. **Toast Notifications**: Provides clear feedback for all actions

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Review error messages in browser console
3. Verify all environment variables
4. Restart services if needed
5. Contact the development team

---

**Ready to revolutionize Kazakhstan's digital future! 🇰🇿✨**