import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonBadge,
  IonButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import { star } from "ionicons/icons";
import { productService } from "../services/productService";
import { QuantityAddButton } from "../components/QuantityAddButton";
import { useCart } from "../contexts/CartContext";
import type { Product } from "../types";
import { useAuth } from "../contexts/AuthContext";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
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
      <IonPage>
        <IonHeader>
          <IonToolbar className="toolbar-primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Produto</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-background">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <IonSpinner name="crescent" className="mb-4" />
              <p className="text-textSecondary">Carregando produto...</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (error || !product) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className="toolbar-primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Erro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding bg-background">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text1 mb-4">
                {error || "Produto não encontrado"}
              </h2>
              <IonButton onClick={() => history.push("/")} color="primary">
                Voltar para Home
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
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
      <IonHeader>
        <IonToolbar className="toolbar-primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Voltar" />
          </IonButtons>
          <IonTitle>Detalhes do Produto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              {/* Imagem Principal */}
              <div className="bg-white rounded-lg p-8 aspect-square flex items-center justify-center shadow-md">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Miniaturas */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`shrink-0 w-20 h-20 bg-white rounded-lg p-2 border-2 transition-colors shadow-sm ${
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Nome do Produto */}
              <h1 className="text-2xl md:text-3xl font-bold text-text1 leading-tight">
                {product.name}
              </h1>

              {/* Preço */}
              <div className="space-y-2">
                {product.isPromotionActive && product.promotionalPrice && (
                  <IonText className="text-base font-medium text-textSecondary line-through">
                    R$ {product.price?.toFixed(2).replace(".", ",")}
                  </IonText>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  <IonText className="text-3xl font-bold text-primary">
                    R$ {currentPrice?.toFixed(2).replace(".", ",")}
                  </IonText>
                  {product.isPromotionActive && product.discountPercentage && (
                    <IonBadge color="secondary" className="text-sm px-3 py-2">
                      {product.discountPercentage}% OFF
                    </IonBadge>
                  )}
                </div>
              </div>

              {/* Estoque e Avaliação */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <IonText className="text-textSecondary text-sm">
                    Estoque:
                  </IonText>
                  <IonText
                    className={`font-semibold text-sm ${
                      product.stockQuantity > 10
                        ? "text-green-600"
                        : product.stockQuantity > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} unidades disponíveis`
                      : "Fora de estoque"}
                  </IonText>
                </div>
                {product.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <IonText className="text-textSecondary text-sm">
                      Avaliação:
                    </IonText>
                    <div className="flex items-center gap-1">
                      <IonIcon icon={star} className="text-yellow-500" />
                      <IonText className="font-semibold text-sm">
                        {product.rating.toFixed(1)}
                      </IonText>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição do Produto */}
              <div className="space-y-4">
                <IonTitle className="text-lg font-semibold text-text1">
                  Descrição do Produto
                </IonTitle>
                <IonText className="text-textSecondary leading-relaxed text-sm">
                  {product.description ||
                    "Produto de alta qualidade com excelente custo-benefício. Ideal para quem busca praticidade e eficiência no dia a dia."}
                </IonText>
                <div className="flex gap-2 flex-wrap">
                  {product.category && (
                    <IonBadge color="light" className="px-3 py-1">
                      Categoria: {product.category}
                    </IonBadge>
                  )}
                  {product.brand && (
                    <IonBadge color="light" className="px-3 py-1">
                      Marca: {product.brand}
                    </IonBadge>
                  )}
                </div>
              </div>

              {/* Botão Integrado com Quantidade */}
              <div className="space-y-4 mt-6">
                {product.stockQuantity > 0 ? (
                  <>
                    <QuantityAddButton
                      quantity={quantity}
                      onQuantityChange={handleQuantityChange}
                      onAdd={handleAddToCart}
                      disabled={isAddingToCart || !isAuthenticated}
                    />
                    {!isAuthenticated && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <IonText className="text-yellow-700 text-sm">
                          Faça login para adicionar produtos ao carrinho
                        </IonText>
                        <IonButton
                          size="small"
                          fill="clear"
                          color="primary"
                          onClick={() => history.push("/auth/login")}
                          className="mt-2"
                        >
                          Fazer Login
                        </IonButton>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <IonText className="text-red-600 font-semibold">
                      Produto fora de estoque
                    </IonText>
                    <IonText className="text-red-500 text-sm mt-1">
                      Este produto não está disponível no momento
                    </IonText>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
