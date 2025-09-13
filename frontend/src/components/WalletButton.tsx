'use client';

import React from 'react';
import { useWallet } from './WalletProvider';
import { Wallet } from 'lucide-react';

export default function WalletButton() {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();

  const formatPublicKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="px-3 py-2 bg-success-100 text-success-800 rounded-lg text-sm">
          <Wallet className="inline w-4 h-4 mr-1" />
          {formatPublicKey(publicKey)}
        </div>
        <button
          onClick={disconnect}
          className="btn btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="btn btn-primary flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}