"use client";

import { AuthProvider } from "@/libs/contexts/AuthContext";
import { CartProvider } from "@/libs/contexts/CartContext";

// import { AuthProvider } from '@/contexts/AuthContext';
// import { CartProvider } from '@/contexts/CartContext';
// TODO: Descomentar após migração dos contextos

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
