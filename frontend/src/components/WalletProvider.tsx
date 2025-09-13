'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simplified wallet context for demo purposes
// In production, you would use @solana/wallet-adapter-react
interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing connection in localStorage
    const savedWallet = localStorage.getItem('walletPublicKey');
    if (savedWallet) {
      setPublicKey(savedWallet);
      setConnected(true);
    }
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      // Try to connect to Phantom wallet first (Solana version)
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        try {
          console.log('Phantom detected, attempting connection...');
          const response = await (window as any).solana.connect();
          const pubKey = response.publicKey.toString();
          setPublicKey(pubKey);
          setConnected(true);
          localStorage.setItem('walletPublicKey', pubKey);
          console.log('✅ Connected to Phantom Solana wallet:', pubKey);
          return;
        } catch (phantomError) {
          console.error('❌ Phantom connection failed:', phantomError);
          console.log('Make sure Phantom is set to Solana network, not Ethereum');
        }
      }
      
      // Try Solflare wallet
      if (typeof window !== 'undefined' && (window as any).solflare?.isSolflare) {
        try {
          console.log('Solflare detected, attempting connection...');
          const response = await (window as any).solflare.connect();
          const pubKey = response.publicKey.toString();
          setPublicKey(pubKey);
          setConnected(true);
          localStorage.setItem('walletPublicKey', pubKey);
          console.log('✅ Connected to Solflare wallet:', pubKey);
          return;
        } catch (solflareError) {
          console.error('❌ Solflare connection failed:', solflareError);
        }
      }
      
      console.log('❌ No Solana wallets detected');
      console.log('Available wallet objects:', Object.keys(window as any).filter(key => key.includes('solana') || key.includes('phantom') || key.includes('solflare')));
      
      // Fallback to demo wallet
      console.log('Using demo wallet (Phantom not available)');
      const demoPublicKey = 'Demo1111111111111111111111111111111111';
      setPublicKey(demoPublicKey);
      setConnected(true);
      localStorage.setItem('walletPublicKey', demoPublicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        await (window as any).solana.disconnect();
      }
      setPublicKey(null);
      setConnected(false);
      localStorage.removeItem('walletPublicKey');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const value = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}