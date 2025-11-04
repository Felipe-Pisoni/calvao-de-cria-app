import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
} from "@ionic/react";
import { close } from "ionicons/icons";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrice: string;
  onPriceChange: (value: string) => void;
}

interface PriceRange {
  label: string;
  value: string;
}

const FILTER_PRICE_RANGES: PriceRange[] = [
  { label: "Todos os preços", value: "" },
  { label: "Até R$40", value: "0-40" },
  { label: "R$40 A R$60", value: "40-60" },
  { label: "R$60 A R$100", value: "60-100" },
  { label: "R$100 A R$200", value: "100-200" },
  { label: "R$200 A R$500", value: "200-500" },
  { label: "Acima de R$500", value: "500+" },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedPrice,
  onPriceChange,
}) => {
  const handlePriceChange = (value: string) => {
    onPriceChange(value);
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      breakpoints={[0, 0.5, 0.75, 1]}
      initialBreakpoint={0.75}
    >
      <IonHeader>
        <IonToolbar className="toolbar-primary">
          <IonTitle className="mx-4">Filtros</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-white">
        <h3 className="text-lg font-medium mb-3 text-text1">Por preço</h3>

        <IonList
          className="bg-white"
          style={{
            background: "white",
          }}
        >
          <IonRadioGroup
            value={selectedPrice}
            onIonChange={(e) => handlePriceChange(e.detail.value)}
          >
            {FILTER_PRICE_RANGES.map((range) => (
              <IonItem onClick={()=> handlePriceChange(range.value)} key={range.value} lines="none" className="bg-white">
                <IonRadio slot="start" value={range.value} className="mr-3" />
                <IonLabel className="text-text1">{range.label}</IonLabel>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>

        {/* Botão de aplicar (opcional, já que a mudança é imediata) */}
        {/* <div className="mt-6 space-y-2">
          <IonButton expand="block" color="primary" onClick={onClose}>
            Aplicar Filtros
          </IonButton>
          {selectedPrice && (
            <IonButton
              expand="block"
              fill="clear"
              color="primary"
              onClick={() => handlePriceChange("")}
            >
              Limpar Filtros
            </IonButton>
          )}
        </div> */}
      </IonContent>
    </IonModal>
  );
};
