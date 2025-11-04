import { useHistory } from "react-router-dom";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
  IonText,
} from "@ionic/react";
import {
  close,
  trashOutline,
  addOutline,
  removeOutline,
  add,
  remove,
} from "ionicons/icons";
import type { CartItem } from "../types";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const history = useHistory();
  const { cart, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Calcular total do carrinho
  const total =
    cart?.items?.reduce(
      (acc: number, item: CartItem) => acc + item.totalItemPrice,
      0
    ) || 0;

  const cartItems = cart?.items || [];

  const handleCheckout = () => {
    if (!isAuthenticated) {
      history.push("/auth/login");
      onClose();
      return;
    }
    history.push("/checkout");
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      breakpoints={[0, 0.5, 0.75, 1]}
      initialBreakpoint={1}
    >
      <IonHeader>
        <IonToolbar className="toolbar-primary">
          <IonTitle className="mx-4">Carrinho</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <IonText color="medium">
              <h3>Seu carrinho está vazio</h3>
              <p>Adicione produtos para continuar</p>
            </IonText>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item: CartItem) => (
              <ProductRowItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateCartItem}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}
      </IonContent>

      <IonFooter className="pb-8 bg-white px-4 space-y-4">
        <div className="flex justify-between items-center">
          <IonText>
            <h2 className="text-xl font-bold">Total</h2>
          </IonText>
          <IonText className="text-primary">
            <h2 className="text-xl font-bold">
              R$ {total?.toFixed(2).replace(".", ",")}
            </h2>
          </IonText>
        </div>
        <IonButton
          expand="block"
          color="primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Finalizar
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

interface ProductRowItemProps {
  item: CartItem;
  onUpdateQuantity: (
    productId: string,
    data: { quantity: number }
  ) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

const ProductRowItem: React.FC<ProductRowItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await onRemove(item.productId);
    } else {
      await onUpdateQuantity(item.productId, { quantity: newQuantity });
    }
  };

  const handleRemove = async () => {
    await onRemove(item.productId);
  };

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
      <img
        src={item.mainImageUrl}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-md"
      />

      <div className="grow flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium leading-tight pr-2">
            {item.name}
          </h3>
          <IonButton
            fill="clear"
            size="small"
            onClick={handleRemove}
            className="m-0 h-8"
          >
            <IonIcon slot="icon-only" icon={trashOutline} color="danger" />
          </IonButton>
        </div>

        <div className="flex items-center justify-between">
          <Counter
            quantity={item.quantity}
            onQuantityChange={handleQuantityChange}
          />
          <IonText color="primary">
            <span className="text-lg font-bold">
              R$ {item.totalItemPrice?.toFixed(2).replace(".", ",")}
            </span>
          </IonText>
        </div>
      </div>
    </div>
  );
};

interface CounterProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const Counter: React.FC<CounterProps> = ({ quantity, onQuantityChange }) => {
  const handleDecrease = () => {
    onQuantityChange(quantity - 1);
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="flex items-center gap-2 ">
      <IonButton
        fill="clear"
        // size="small"
        className="text-text1"
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        <IonIcon slot="icon-only" icon={remove} />
      </IonButton>
      <IonText className="px-3 font-medium min-w-8 text-center text-text1">
        {quantity}
      </IonText>
      <IonButton
        className="text-text1"
        fill="clear"
        // size="small"
        onClick={handleIncrease}
      >
        <IonIcon slot="icon-only" icon={add} />
      </IonButton>
    </div>
  );
};
