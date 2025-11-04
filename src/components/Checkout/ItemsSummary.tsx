'use client';
import { useCart } from "@/libs/contexts/CartContext";
import { ProductRowItem } from "../Home/ShoppingCartDrawer";

export const ItemsSummary = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const items = cart?.items ?? [];

  const total = items.reduce(
    (acc, item) => acc + item.totalItemPrice,
    0
  );
  return (
    <div className="w-full md:w-80 lg:w-96 border border-primary bg-white rounded-lg shadow-md  flex-shrink-0">
      <div className="bg-primary text-white text-lg font-semibold p-3 justify-center flex rounded-t-lg">
        Itens
      </div>
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <ProductRowItem
            onRemove={removeFromCart}
            onUpdateQuantity={updateCartItem}
            item={item}
          />
        ))}
      </div>
      <div className="p-4 border-t border-primary bg-white rounded-b-lg flex justify-between items-center">
        <span className="text-xl font-bold text-text-primary">Total</span>
        <span className="text-xl font-bold text-primary">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>
    </div>
  );
};
