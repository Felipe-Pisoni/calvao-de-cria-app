"use client";

import { useState, forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cepService, type AddressData } from "@/libs/services/cepService";

interface CepInputBareProps {
  value?: string;
  onChange?: (value: string) => void;
  onAddressFound?: (address: AddressData) => void;
  placeholder?: string;
  isEditing ?: boolean;
  [key: string]: any;
}

export const CepInputBare = forwardRef<HTMLInputElement, CepInputBareProps>(
  (
    {
      value = "",
      onChange,
      onAddressFound,
      placeholder = "CEP",
      isEditing = false,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAccept = async (maskedValue: string) => {
      const unmasked = maskedValue.replace(/\D/g, "");

      // Chama onChange com o valor não mascarado
      if (onChange) {
        onChange(unmasked);
      }

      // Se o CEP está completo (8 dígitos), busca o endereço
      if (unmasked.length === 8 && onAddressFound && !isEditing) {
        setIsLoading(true);
        try {
          const addressData = await cepService.fetchAddressByCep(unmasked);
          if (addressData ) {
            onAddressFound(addressData);
          }
        } catch (err) {
          console.error("Erro ao buscar CEP:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    return (
      <div className="relative">
        {/* <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary">
          <MapPin size={20} />
        </div> */}
        <IMaskInput
          {...props}
          mask="00000-000"
          value={value}
          ref={ref}
          onAccept={handleAccept}
          placeholder={placeholder}
          className="w-full  p-2 outline-none focus-within:border-secondary border-b border-primary"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    );
  }
);

CepInputBare.displayName = "CepInputBare";