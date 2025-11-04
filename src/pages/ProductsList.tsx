import { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonText,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonImg,
} from "@ionic/react";
import { funnel, cartOutline, personCircleOutline } from "ionicons/icons";
import { ProductCard } from "../components/ProductCard";
import { FilterDrawer } from "../components/FilterDrawer";
import { ShoppingCartDrawer } from "../components/ShoppingCartDrawer";
import { productService } from "../services/productService";
import type { Product } from "../types";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const ProductsList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "offers">("products");

  const ITEMS_PER_PAGE = 8;

  // Calcular total de itens no carrinho
  const cartItemsCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Buscar produtos (primeira carga ou quando filtros mudam)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCurrentPage(1);
      try {
        let minPrice: number | undefined;
        let maxPrice: number | undefined;

        if (selectedPrice) {
          if (selectedPrice.includes("+")) {
            minPrice = parseInt(selectedPrice.replace("+", ""));
          } else {
            const [min, max] = selectedPrice.split("-").map(Number);
            minPrice = min;
            maxPrice = max;
          }
        }

        const response = await productService.getProducts({
          search: searchTerm || undefined,
          minPrice,
          maxPrice,
          page: 1,
          limit: ITEMS_PER_PAGE,
          inPromotion: activeTab === "offers" ? true : undefined,
        });

        setProducts(response.data || []);
        setHasMore((response.data || []).length >= ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedPrice, activeTab]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value: string) => {
    setSelectedPrice(value);
    setIsFilterDrawerOpen(false);
  };

  const handleTabChange = (tab: "products" | "offers") => {
    setActiveTab(tab);
    setSearchTerm("");
    setSelectedPrice("");
  };

  // Carregar mais produtos (infinite scroll)
  const loadMoreProducts = async (event: any) => {
    if (!hasMore) {
      event.target.complete();
      return;
    }

    try {
      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (selectedPrice) {
        if (selectedPrice.includes("+")) {
          minPrice = parseInt(selectedPrice.replace("+", ""));
        } else {
          const [min, max] = selectedPrice.split("-").map(Number);
          minPrice = min;
          maxPrice = max;
        }
      }

      const nextPage = currentPage + 1;
      const response = await productService.getProducts({
        search: searchTerm || undefined,
        minPrice,
        maxPrice,
        page: nextPage,
        limit: ITEMS_PER_PAGE,
        inPromotion: activeTab === "offers" ? true : undefined,
      });

      const newProducts = response.data || [];

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setCurrentPage(nextPage);
        setHasMore(newProducts.length >= ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar mais produtos:", error);
      setHasMore(false);
    } finally {
      event.target.complete();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-primary">
          <IonTitle className="mx-4">Produtos</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative"
            >
              <IonIcon slot="icon-only" icon={cartOutline} />
              {cartItemsCount > 0 && (
                <IonBadge
                  color="danger"
                  className="absolute -top-2 -right-2 text-xs min-w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {cartItemsCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton
              className={isAuthenticated && user ? "bg-secondary rounded-full w-8 h-8" : ""}
            //   fill={!isAuthenticated ? "clear" : "default"}
            //   color="secondary"
              onClick={() =>
                isAuthenticated
                  ? history.push("/profile/settings")
                  : history.push("/auth/login")
              }
            >
              {isAuthenticated && user ? (
                <IonText>
                  {user.name
                    ?.split(" ")
                    .map((x) => x[0])
                    .join("")}
                </IonText>
              ) : (
                <IonIcon slot="icon-only" icon={personCircleOutline} />
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar className="toolbar-white border-b-2 border-b-primary">
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => handleSearch(e.detail.value!)}
            placeholder="Buscar produtos..."
            debounce={500}
            animated
            className="ion-no-padding"
          />
        </IonToolbar>
        <IonToolbar className="toolbar-white">
          <IonSegment
            value={activeTab}
            onIonChange={(e) =>
              handleTabChange(e.detail.value as "products" | "offers")
            }
            className="bg-white"
          >
            <IonSegmentButton value="products">
              <IonLabel className="text-text1">Produtos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="offers">
              <IonLabel className="text-text1">Promoções</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-background pb-24">
        {/* Filtro selecionado */}
        {selectedPrice && (
          <div className="mb-4 gap-4 flex items-center">
            <IonText class="text-sm">
              Filtro ativo: {getPriceLabel(selectedPrice)}
            </IonText>
            <IonButton
              //   fill="clear"
              size="small"
              onClick={() => handlePriceChange("")}
            >
              Limpar
            </IonButton>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <IonSpinner name="crescent" />
          </div>
        )}

        {/* Sem resultados */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <IonText color="medium">
              <h3>Nenhum produto encontrado</h3>
            </IonText>
            {(searchTerm || selectedPrice) && (
              <IonButton
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPrice("");
                  setCurrentPage(1);
                }}
              >
                Limpar filtros
              </IonButton>
            )}
          </div>
        )}

        {/* Grid de produtos */}
        {!loading && products.length > 0 && (
          <IonGrid className="mb-12">
            <IonRow className="gap-4">
              {products.map((product) => (
                <IonCol
                  key={product.id}
                  size="12"
                  sizeSm="6"
                  sizeMd="4"
                  sizeLg="3"
                  className="mb-4"
                >
                  <ProductCard product={product} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        {/* Infinite Scroll */}
        <IonInfiniteScroll
          onIonInfinite={loadMoreProducts}
          threshold="100px"
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent
            loadingSpinner="crescent"
            loadingText="Carregando mais produtos..."
          />
        </IonInfiniteScroll>
      </IonContent>

      {/* Footer com botão de filtros */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <IonButton
          expand="block"
          color="primary"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <IonIcon className="mr-2" slot="start" icon={funnel} />
          Filtros
        </IonButton>
      </div>

      {/* Drawers */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedPrice={selectedPrice}
        onPriceChange={handlePriceChange}
      />
      <ShoppingCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </IonPage>
  );
};

// Helper function
const getPriceLabel = (value: string): string => {
  const priceRanges: Record<string, string> = {
    "0-40": "Até R$40",
    "40-60": "R$40 A R$60",
    "60-100": "R$60 A R$100",
    "100-200": "R$100 A R$200",
    "200-500": "R$200 A R$500",
    "500+": "Acima de R$500",
  };
  return priceRanges[value] || value;
};

export default ProductsList;
