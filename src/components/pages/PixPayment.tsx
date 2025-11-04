'use client'
import { useState } from "react";
import { PixLogoIcon } from "@phosphor-icons/react";
import { Button } from "..";

export const PixPaymentPage = () => {
  const [pixCode] = useState("00020126540014br.gov.bcb.pix0123456789");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar código PIX:', err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-itemsBackground p-8 rounded-xl shadow-lg">
      <div className="flex gap-2 mb-6">
        <PixLogoIcon className="text-primary mt-1 w-10 h-10" />
        <p className="font-semibold text-lg">
          Pague via Pix para garantir sua compra
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-textSecondary mb-2">
          Seu pedido foi criado com sucesso! Escaneie o QR Code ou copie o código PIX abaixo para finalizar o pagamento.
        </p>
      </div>

      <div className="flex items-center border border-primary rounded-md p-2 mb-4">
        <input
          type="text"
          readOnly
          value={pixCode}
          className="text-sm text-textSecondary flex-grow outline-none bg-transparent"
        />
        <button 
          onClick={copyToClipboard}
          className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
        >
          {isCopied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      
      <div className="flex-1 flex justify-center items-center h-[200px] mb-6">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`}
          alt="QR Code PIX"
          className="mx-auto h-full my-4"
        />
      </div>
      
      <div className="space-y-3">
        <Button href="/profile/orders">Ver detalhes do pedido</Button>
        <Button variant="outline" href="/">
          Voltar à loja
        </Button>
      </div>
    </div>
  );
};
