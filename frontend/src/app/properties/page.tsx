'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@/components/WalletProvider';
import { propertyApi, handleApiError } from '@/lib/api';
import type { Property } from '@/types';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Users,
  Calendar,
  ShoppingCart,
  Percent,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface PurchaseModal {
  property: Property | null;
  tokenAmount: number;
}

export default function PropertiesPage() {
  const { connected, publicKey } = useWallet();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseModal, setPurchaseModal] = useState<PurchaseModal>({
    property: null,
    tokenAmount: 1
  });
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyApi.getAllProperties();
      setProperties(data);
    } catch (error) {
      toast.error('Failed to load properties: ' + handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const openPurchaseModal = (property: Property) => {
    if (!connected) {
      toast.error('Please connect your wallet to purchase tokens');
      return;
    }
    setPurchaseModal({ property, tokenAmount: 1 });
  };

  const closePurchaseModal = () => {
    setPurchaseModal({ property: null, tokenAmount: 1 });
  };

  const handlePurchase = async () => {
    if (!connected || !publicKey || !purchaseModal.property) return;

    const { property, tokenAmount } = purchaseModal;
    
    if (tokenAmount <= 0 || tokenAmount > (property.tokensAvailable || 0)) {
      toast.error('Invalid token amount');
      return;
    }

    setPurchasing(true);
    try {
      const signature = await propertyApi.buyTokens({
        buyerPublicKey: publicKey,
        propertyId: property.id,
        tokenAmount
      });

      toast.success(`Successfully purchased ${tokenAmount} tokens! Transaction: ${signature.slice(0, 8)}...`);
      
      // Update local state
      setProperties(prev => prev.map(p => 
        p.id === property.id 
          ? { ...p, tokensSold: p.tokensSold + tokenAmount }
          : p
      ));
      
      closePurchaseModal();
    } catch (error) {
      toast.error('Failed to purchase tokens: ' + handleApiError(error));
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="card">
                <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Real Estate Investment</h1>
        <p className="text-slate-600 mt-2">
          Invest in fractional real estate ownership with as little as $100
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {properties.map((property) => {
          const tokensAvailable = property.totalTokens - property.tokensSold;
          const ownershipSold = (property.tokensSold / property.totalTokens * 100).toFixed(1);
          
          return (
            <div key={property.id} className="card overflow-hidden">
              {/* Property Image */}
              <div className="relative h-48 mb-4 bg-slate-100 rounded-lg overflow-hidden">
                <Image
                  src={property.imageUrl}
                  alt={property.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400/059669/FFFFFF?text=' + encodeURIComponent(property.name);
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {property.status === 'active' ? 'Available' : 'Sold Out'}
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{property.name}</h3>
                  <div className="flex items-center space-x-1 text-slate-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm">{property.description}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <DollarSign className="w-3 h-3" />
                      <span>Total Value:</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      ${property.totalValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Annual Return:</span>
                    </div>
                    <div className="font-semibold text-green-600">
                      {property.annualReturn}%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Users className="w-3 h-3" />
                      <span>Tokens Available:</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      {tokensAvailable.toLocaleString()} / {property.totalTokens.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Calendar className="w-3 h-3" />
                      <span>Monthly Rent:</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      ${property.monthlyRent.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Ownership Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Ownership Sold</span>
                    <span className="text-sm font-medium">{ownershipSold}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ownershipSold}%` }}
                    ></div>
                  </div>
                </div>

                {/* Investment Info */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Price per token:</span>
                    <span className="font-semibold">${property.pricePerToken}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-slate-600">Min. investment:</span>
                    <span className="font-semibold">${property.pricePerToken}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => openPurchaseModal(property)}
                  disabled={tokensAvailable === 0 || !connected}
                  className={`w-full btn flex items-center justify-center space-x-2 ${
                    tokensAvailable > 0 && connected
                      ? 'btn-primary'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {!connected 
                      ? 'Connect Wallet to Invest'
                      : tokensAvailable === 0 
                      ? 'Sold Out'
                      : 'Buy Tokens'
                    }
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              How Real Estate Tokenization Works
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Properties are divided into fungible SPL tokens on Solana</li>
              <li>• Each token represents fractional ownership of the property</li>
              <li>• Rent is distributed monthly proportional to token ownership</li>
              <li>• Tokens can be traded on secondary markets (future feature)</li>
              <li>• All transactions are transparent and recorded on blockchain</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {purchaseModal.property && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Purchase Property Tokens
              </h3>
              <button
                onClick={closePurchaseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900">
                  {purchaseModal.property.name}
                </h4>
                <p className="text-sm text-slate-600">
                  {purchaseModal.property.location}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Price per token:</span>
                  <span className="font-medium">${purchaseModal.property.pricePerToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available tokens:</span>
                  <span className="font-medium">
                    {(purchaseModal.property.totalTokens - purchaseModal.property.tokensSold).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="label">Number of Tokens</label>
                <input
                  type="number"
                  min="1"
                  max={purchaseModal.property.totalTokens - purchaseModal.property.tokensSold}
                  value={purchaseModal.tokenAmount}
                  onChange={(e) => setPurchaseModal({
                    ...purchaseModal,
                    tokenAmount: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  className="input"
                />
              </div>

              <div className="bg-green-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total cost:</span>
                  <span className="font-semibold">
                    ${(purchaseModal.tokenAmount * purchaseModal.property.pricePerToken).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ownership percentage:</span>
                  <span className="font-semibold">
                    {((purchaseModal.tokenAmount / purchaseModal.property.totalTokens) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Est. monthly rent:</span>
                  <span className="font-semibold text-green-600">
                    ${Math.round((purchaseModal.property.monthlyRent * purchaseModal.tokenAmount) / purchaseModal.property.totalTokens)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={closePurchaseModal}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {purchasing ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Purchase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}