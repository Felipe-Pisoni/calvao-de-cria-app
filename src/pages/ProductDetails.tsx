import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Button } from "../components/Button";
import { QuantityAddButton } from "../components/QuantityAddButton";
import { useCart } from "../contexts/CartContext";
import type { Product } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {isAuthenticated} = useAuth();
  
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
        console.error('Erro ao carregar produto:', error);
        setError('Erro ao carregar produto');
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
            {error || 'Produto não encontrado'}
          </h2>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.mainImage];

  const currentPrice = product.isPromotionActive && product.promotionalPrice 
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
        quantity: quantity
      });
      // Opcional: mostrar feedback de sucesso
      console.log('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      // Opcional: mostrar feedback de erro
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-text-primary hover:text-primary transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
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
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg p-2 border-2 transition-colors shadow-sm ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent"
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
          <div className="space-y-8">
            {/* Nome do Produto */}
            <h1 className="text-3xl font-bold text-text1 leading-tight">
              {product.name}
            </h1>

            {/* Preço */}
            <div className="space-y-2">
              {product.isPromotionActive && product.promotionalPrice && (
                <div className="text-lg font-medium text-textSecondary line-through">
                  R$ {product.price?.toFixed(2).replace(".", ",")}
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">
                  R$ {currentPrice?.toFixed(2).replace(".", ",")}
                </div>
                {product.isPromotionActive && product.discountPercentage && (
                  <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.discountPercentage}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-textSecondary">Estoque:</span>
                <span className={`font-semibold ${
                  product.stockQuantity > 10 
                    ? 'text-green-600' 
                    : product.stockQuantity > 0 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {product.stockQuantity > 0 
                    ? `${product.stockQuantity} unidades disponíveis`
                    : 'Fora de estoque'
                  }
                </span>
              </div>
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-textSecondary">Avaliação:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Descrição do Produto */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-text1">
                Descrição do Produto
              </h3>
              <p className="text-textSecondary leading-relaxed">
                {product.description || "Produto de alta qualidade com excelente custo-benefício. Ideal para quem busca praticidade e eficiência no dia a dia."}
              </p>
              {product.category && (
                <div className="inline-block bg-background px-3 py-1 rounded-full text-sm text-textSecondary">
                  Categoria: {product.category}
                </div>
              )}
              {product.brand && (
                <div className="inline-block bg-background px-3 py-1 rounded-full text-sm text-textSecondary ml-2">
                  Marca: {product.brand}
                </div>
              )}
            </div>

            {/* Botão Integrado com Quantidade */}
            <div className="space-y-6">
              {product.stockQuantity > 0 ? (
                <QuantityAddButton
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onAdd={handleAddToCart}
                  disabled={isAddingToCart || !isAuthenticated}
                />
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-red-600 font-semibold">Produto fora de estoque</p>
                  <p className="text-red-500 text-sm mt-1">
                    Este produto não está disponível no momento
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
