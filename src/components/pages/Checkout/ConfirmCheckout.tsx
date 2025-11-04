'use client';
import { Button } from "../..";
import { useCheckout } from "@/libs/contexts/CheckoutContext";
import { MapPinAreaIcon, PixLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";

export const ConfirmationCheckoutPage = () => {
  const { 
    addresses, 
    selectedAddressId, 
    paymentMethod, 
    setPaymentMethod,
    isProcessingOrder,
    finalizePurchase 
  } = useCheckout();

  const selectedAddress = addresses.find(addr => addr.addressId === selectedAddressId);

  const handleFinalizePurchase = async () => {
    if (!paymentMethod) {
      setPaymentMethod('pix'); // Default to Pix
    }
    
    const orderResult = await finalizePurchase();
    if (orderResult) {
      // Redirecionar para página de pagamento ou sucesso
      window.location.href = '/payment/pix';
    }
  };

  if (!selectedAddress) {
    return (
      <div className="text-center py-8">
        <p className="text-textSecondary mb-4">Nenhum endereço selecionado</p>
        <Button size="small" href="/checkout">
          Voltar e selecionar endereço
        </Button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-medium mb-4">Revise e confirme sua compra</h2>
      <div className="space-y-6">
        <Card
          title="Endereço de entrega"
          internal={{
            title: selectedAddress.alias,
            description: `${selectedAddress.street}, ${selectedAddress.number}${selectedAddress.complement ? `, ${selectedAddress.complement}` : ''}\n${selectedAddress.neighborhood}, ${selectedAddress.city}/${selectedAddress.state}\nCEP: ${selectedAddress.cep || 'N/A'}\nTelefone: ${selectedAddress.phone || 'N/A'}`,
            icon: <MapPinAreaIcon className="text-primary mt-1 w-6 h-6" />,
            action: (
              <Link
                href="/checkout"
                className="ml-auto text-primary font-semibold text-sm whitespace-nowrap"
                onClick={() => {}}
              >
                Editar ou escolher outro
              </Link>
            ),
          }}
        />
        <Card
          title="Método de pagamento"
          internal={{
            title: "Pix",
            description: "Pagamento via Pix - Aprovação instantânea",
            icon: <PixLogoIcon className="text-primary mt-1 w-6 h-6" />,
          }}
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button size="small" variant="outline" href={`/checkout/`}>
          Voltar
        </Button>
        <Button 
          size="small" 
          onClick={handleFinalizePurchase}
          disabled={isProcessingOrder}
        >
          {isProcessingOrder ? 'Finalizando...' : 'Finalizar pedido'}
        </Button>
      </div>
    </>
  );
};
const Card = ({
  internal,
  title,
}: {
  title: string;
  internal: {
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
  };
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="bg-itemsBackground flex gap-2 items-start p-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-4 flex-1">
          {internal.icon}
          <div>
            <p className="font-bold">{internal.title}</p>
            <p className="text-sm text-textSecondary whitespace-pre-line">{internal.description}</p>
          </div>
        </div>
        {internal.action}
      </div>
    </div>
  );
};
