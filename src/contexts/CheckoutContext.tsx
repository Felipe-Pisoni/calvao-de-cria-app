import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressService } from '../services/addressService';
import { checkoutService, type CheckoutData, type OrderSummary } from '../services/checkoutService';
import { useCart } from './CartContext';
import type { Address } from '../types';

interface CheckoutContextType {
  // Address management
  addresses: Address[];
  selectedAddressId: string | null;
  isLoadingAddresses: boolean;
  addressError: string | null;
  
  // Actions
  loadAddresses: () => Promise<void>;
  selectAddress: (addressId: string) => void;
  deleteAddress: (addressId: string) => Promise<void>;
  
  // Order data
  paymentMethod: 'pix' | 'card' | null;
  setPaymentMethod: (method: 'pix' | 'card' | null) => void;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
  
  // Checkout flow
  isCheckoutComplete: boolean;
  setIsCheckoutComplete: (complete: boolean) => void;
  isProcessingOrder: boolean;
  orderSummary: OrderSummary | null;
  
  // Checkout actions
  finalizePurchase: () => Promise<OrderSummary | null>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>('pix');
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      setAddressError(null);
      
      const addressesData = await addressService.getAddresses();
      setAddresses(addressesData);
      
      // Se não há endereços, redirecionar para criar um novo
      if (addressesData.length === 0) {
        navigate('/checkout/address/');
        return;
      }
      
      // Selecionar o primeiro endereço se nenhum estiver selecionado
      if (!selectedAddressId && addressesData.length > 0) {
        const defaultAddress = addressesData[0];
        setSelectedAddressId(defaultAddress.addressId);
      }
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
      setAddressError('Erro ao carregar endereços');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const selectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const deleteAddress = async (addressId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await addressService.deleteAddress(addressId);
        
        // Verificar se era o último endereço
        if (addresses.length === 1) {
          // Se era o último endereço, redirecionar para criar um novo
          navigate('/checkout/address/');
          return;
        }
        
        await loadAddresses();
        
        // Se o endereço deletado era o selecionado, selecionar outro
        if (selectedAddressId === addressId) {
          const remainingAddresses = addresses.filter(addr => addr.addressId !== addressId);
          setSelectedAddressId(remainingAddresses[0]?.addressId || null);
        }
      } catch (err) {
        console.error('Erro ao deletar endereço:', err);
        alert('Erro ao deletar endereço');
      }
    }
  };

  const finalizePurchase = async (): Promise<OrderSummary | null> => {
    if (!selectedAddressId || !paymentMethod) {
      alert('Selecione um endereço e método de pagamento');
      return null;
    }

    try {
      setIsProcessingOrder(true);
      
      const checkoutData: CheckoutData = {
        addressId: selectedAddressId,
        paymentMethodIdentifier : paymentMethod,
        // ...(couponCode && { couponCode })
      };
      console.log("🚀 ~ finalizePurchase ~ checkoutData:", checkoutData)

      const orderResult = await checkoutService.finalizePurchase(checkoutData);
      setOrderSummary(orderResult);
      setIsCheckoutComplete(true);
      
      // Limpar carrinho após pedido finalizado com sucesso
      clearCart();
      
      return orderResult;
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      alert('Erro ao finalizar pedido. Tente novamente.');
      return null;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Carregar endereços quando o componente monta
  useEffect(() => {
    loadAddresses();
  }, []);

  const value: CheckoutContextType = {
    addresses,
    selectedAddressId,
    isLoadingAddresses,
    addressError,
    loadAddresses,
    selectAddress,
    deleteAddress,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    setCouponCode,
    isCheckoutComplete,
    setIsCheckoutComplete,
    isProcessingOrder,
    orderSummary,
    finalizePurchase,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};