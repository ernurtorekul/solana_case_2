import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WalletProvider } from '@/components/WalletProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'National Tokenization Hub - Kazakhstan',
  description: 'Blockchain-powered citizen platform built on Solana for Kazakhstan\'s digital transformation',
  keywords: 'blockchain, solana, kazakhstan, nft, tokenization, certificates, real estate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              className: 'bg-white border shadow-lg',
            }}
          />
        </WalletProvider>
      </body>
    </html>
  );
}