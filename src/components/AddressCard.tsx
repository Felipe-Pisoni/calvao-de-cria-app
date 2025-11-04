import { Address } from "@/types";
import {
  PencilSimpleLineIcon,
  TrashIcon,
  UserIcon,
} from "@phosphor-icons/react";

export const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  console.log(address);
  return (
    <div className="relative">
      {/* Badge de selecionado */}
      {isSelected && (
        <div className="w-full absolute bg-primary text-white text-sm font-semibold px-4 py-1 z-10 border border-primary">
          Selecionado
        </div>
      )}

      <div
        className={`p-4 rounded border-1 h-52 flex flex-col justify-end bg-white transition-colors cursor-pointer ${
          isSelected ? "border-primary" : "border-gray-200 hover:border-primary"
        }`}
        onClick={onSelect}
      >
        <div className="flex justify-between items-start mb-3 mt-2">
          <div className="flex gap-3 items-center">
            <h3 className="font-semibold text-text-primary">{address.alias}</h3>
            {!isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="text-primary font-medium text-sm hover:underline"
              >
                Selecionar
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <PencilSimpleLineIcon />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <UserIcon />
          <p className="text-sm text-textSecondary font-semibold">
            {address.recipientName}
          </p>
        </div>

        <p className="text-sm text-textSecondary leading-relaxed">
          {address.street}, {address.number}
          {address.complement && `, ${address.complement}`}
          <br />
          {address.neighborhood}, {address.city} - {address.state}
          <br />
          CEP: {address.cep}
          <br />
          Tel: {address.phone}
        </p>
      </div>
    </div>
  );
};
