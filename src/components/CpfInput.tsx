"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { IdentificationCardIcon } from "@phosphor-icons/react";

interface CpfInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
}

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  ({ onChange, placeholder = "CPF", value, ...props }, ref) => {
    const handleAccept = (unmaskedValue: string) => {
      // O unmaskedValue aqui já vem sem máscara quando unmask=true
      if (onChange) {
        // Cria um evento sintético completo
        const syntheticEvent = {
          target: {
            value: unmaskedValue,
            name: props.name || '',
          },
          currentTarget: {
            value: unmaskedValue,
            name: props.name || '',
          },
          preventDefault: () => {},
          stopPropagation: () => {},
          nativeEvent: {} as Event,
          type: 'change',
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          persist: () => {},
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
        } as React.ChangeEvent<HTMLInputElement>;
        
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <IdentificationCardIcon size={20} />
        </div>
        <IMaskInput
          {...props}
          mask="000.000.000-00"
          unmask={true} // Retorna valor sem máscara
          value={value}
          ref={ref}
          onAccept={handleAccept}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>
    );
  }
);

CpfInput.displayName = 'CpfInput';
