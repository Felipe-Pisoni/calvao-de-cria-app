"use client";
import { Button } from "@/components";
import { useCheckout } from "@/libs/contexts/CheckoutContext";
import type { Address } from "@/types";

import {
  MapPinIcon,
  PencilSimpleLineIcon,
  UserIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { AddressCard } from "../../AddressCard";

export const AddressPage = () => {
  const router = useRouter();
  const {
    addresses,
    selectedAddressId,
    isLoadingAddresses,
    addressError,
    selectAddress,
    deleteAddress,
    loadAddresses,
  } = useCheckout();

  if (isLoadingAddresses) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando endereços...</p>
      </div>
    );
  }

  if (addressError) {
    return (
      <div className="text-center text-red-500">
        <p>{addressError}</p>
        <Button size="small" onClick={loadAddresses} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-medium mb-6 flex items-center gap-2 text-text-primary">
        <MapPinIcon />
        Escolha um endereço para entregar
      </h2>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-textSecondary mb-4">
            Você ainda não tem endereços cadastrados
          </p>
          <Button size="small" href="/checkout/address/">
            Cadastrar primeiro endereço
          </Button>
        </div>
      ) : (
        <>
          {/* Grid 2x2 dos endereços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.addressId}
                address={addr}
                isSelected={selectedAddressId === addr.addressId}
                onSelect={() => selectAddress(addr.addressId)}
                onEdit={() =>
                  router.push(`/checkout/address/${addr.addressId}`)
                }
                onDelete={() => deleteAddress(addr.addressId)}
              />
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button size="small" variant="outline" href="/checkout/address/">
              Novo endereço
            </Button>
            <Button
              size="small"
              href="/checkout/confirm"
              disabled={!selectedAddressId}
            >
              Continuar
            </Button>
          </div>
        </>
      )}
    </>
  );
};
