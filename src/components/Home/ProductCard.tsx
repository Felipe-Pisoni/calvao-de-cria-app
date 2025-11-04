import { IonCard, IonCardContent } from "@ionic/react";
import type { Product } from "../../types";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    // 1. Usamos IonCard como container
    // routerLink é o equivalente do <Link> do react-router
    <IonCard routerLink={`/product/${product.id}`} className="m-0">
      {/* 2. Imagem (pode usar IonImg para lazy loading nativo) */}
      <img
        src={product.mainImage}
        alt={product.name}
        className="w-full h-40 object-cover" // Classes Tailwind
      />

      {/* 3. Conteúdo do Card */}
      <IonCardContent className="p-3">
        {/* Mantemos todas as classes Tailwind para o conteúdo */}
        <span className="text-sm text-text1 line-clamp-2">{product.name}</span>

        {product.isPromotionActive ? (
          <>
            <span className="text-xs font-bold text-textSecondary line-through">
              R$ {product.price.toFixed(2)}
            </span>
            <div className="flex gap-2 items-center font-bold">
              <span className="text-primary text-xl">
                R$ {product.promotionalPrice?.toFixed(2)}
              </span>
              <div className="text-xs bg-secondary rounded-lg text-white h-5 flex justify-center items-center px-2">
                <span>{product.discountPercentage}% OFF</span>
              </div>
            </div>
          </>
        ) : (
          <span className="text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        )}
      </IonCardContent>
    </IonCard>
  );
};
