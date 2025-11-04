import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonButton,
  IonFooter,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { add, remove } from "ionicons/icons";
import { productService } from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import type { Product } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

// Import Swiper (integrado com Ionic) para a galeria
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { QuantityAddButton } from "../QuantityAddButton";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Carregar produto por ID
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      ("");
      setIsLoading(true);
      setError(null);
      try {
        const productData = await productService.getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setError("Erro ao carregar produto");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Estados de loading e erro
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>
          </div>
          <p className="text-textSecondary">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text1 mb-4">
            {error || "Produto não encontrado"}
          </h2>
          <IonButton onClick={() => router.push("/")}>
            Voltar para Home
          </IonButton>
        </div>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.mainImage];

  const currentPrice =
    product.isPromotionActive && product.promotionalPrice
      ? product.promotionalPrice
      : product.price;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
      });
      // Opcional: mostrar feedback de sucesso
      console.log("Produto adicionado ao carrinho com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      // Opcional: mostrar feedback de erro
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <IonPage>
      {/* 1. Header com botão de voltar nativo */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{product.name.substring(0, 20)}...</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* 2. Conteúdo da página */}
      <IonContent>
        {/* 3. Galeria de Imagens com Swiper (muito melhor que as miniaturas) */}
        <Swiper>
          {productImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={product.name}
                className="w-full h-64 object-contain bg-white"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 4. Conteúdo (Mantendo Tailwind!) */}
        <div className="p-4 space-y-4">
          <h1 className="text-3xl font-bold text-text1 leading-tight">
            {product.name}
          </h1>

          {/* Preço (igual) */}
          <div className="space-y-2">
            {product.isPromotionActive && (
              <div className="text-lg font-medium text-textSecondary line-through">
                R$ {product.price?.toFixed(2).replace(".", ",")}
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">
                R$ {currentPrice?.toFixed(2).replace(".", ",")}
              </div>
              {product.isPromotionActive && (
                <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Estoque (igual) */}
          <div className="text-sm">
            <span className="text-textSecondary">Estoque: </span>
            <span className="font-semibold text-green-600">
              {product.stockQuantity} unidades
            </span>
          </div>

          {/* Descrição (igual) */}
          <div className="space-y-2 pt-4">
            <h3 className="text-xl font-semibold text-text1">Descrição</h3>
            <p className="text-textSecondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 5. Seletor de Quantidade (Padrão Ionic) */}
          <div className="flex items-center justify-center gap-4 py-4">
            <IonButton
              fill="outline"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <IonIcon slot="icon-only" icon={remove} />
            </IonButton>
            <span className="text-2xl font-bold w-12 text-center">
              {quantity}
            </span>
            <IonButton
              fill="outline"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stockQuantity}
            >
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </div>
        </div>
      </IonContent>

      {/* 6. Footer flutuante (padrão nativo) */}
      <IonFooter>
        <IonToolbar>
          <div className="p-2">
            <IonButton
              expand="block"
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                !isAuthenticated ||
                product.stockQuantity === 0
              }
            >
              {isAddingToCart
                ? "Adicionando..."
                : product.stockQuantity === 0
                ? "Fora de estoque"
                : "Adicionar ao Carrinho"}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
