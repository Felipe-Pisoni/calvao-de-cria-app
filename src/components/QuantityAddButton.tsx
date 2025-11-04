import { IonButton, IonIcon, IonText } from "@ionic/react";
import { add, remove } from "ionicons/icons";

interface QuantityAddButtonProps {
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onAdd?: () => void;
  disabled?: boolean;
}

export const QuantityAddButton = ({
  quantity,
  onQuantityChange,
  onAdd,
  disabled = false,
}: QuantityAddButtonProps) => {
  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
    }
  };

  return (
    <div
      className={`bg-primary rounded-lg flex items-center text-white font-semibold overflow-hidden ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <IonButton
        onClick={() => !disabled && onQuantityChange(-1)}
        size="small"
        fill="clear"
        disabled={disabled || quantity <= 1}
        className="hover:bg-opacity-80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IonIcon icon={remove} />
      </IonButton>

      <IonText className="px-4 py-3 text-lg font-semibold">{quantity}</IonText>

      <IonButton
        onClick={() => !disabled && onQuantityChange(1)}
        disabled={disabled}
        size="small"
        fill="clear"
        className="hover:bg-opacity-80 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IonIcon icon={add} />
      </IonButton>

      <IonButton
        onClick={handleAddClick}
        disabled={disabled}
        fill="clear"
        className="flex-1 text-center hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Adicionar
      </IonButton>
    </div>
  );
};
