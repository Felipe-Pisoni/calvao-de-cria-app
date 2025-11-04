import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonSpinner,
  IonButtons,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import { filter, cart, personCircle } from "ionicons/icons";
import { productService } from "../../services/productService";
import type { Product, ProductFilters, ProductsResponse } from "../../types";
import { Pagination } from "../../components/Pagination"; // Seu componente de paginação
import { useDebounce } from "../../hooks/use-debouce";

export const HomeContent = () => {
  const searchParams = {
    get: (key: string) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(key);
    },
    has: (key: string) => {
      const params = new URLSearchParams(window.location.search);
      return params.has(key);
    },
  };

  const openFilterModal = () => {
    // Lógica para abrir um <IonModal> com os filtros
    console.log("Abrir modal de filtros");
  };
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productDetails, setProductDetails] = useState<ProductsResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const isOffersTab = searchParams.get("tab") === "offers";

  useEffect(() => {
    const urlSearchTerm = searchParams.get("search");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      setCurrentPage(1); // Reset para primeira página ao buscar
    }

    setCurrentPage(1);
    setSelectedPrice("");
    setSearchTerm("");
  }, [searchParams]);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const filters: ProductFilters = {
        page: currentPage,
        limit: 12,
      };

      // Aplicar filtro de promoções se a aba "offers" estiver ativa
      if (isOffersTab) {
        filters.inPromotion = true;
      }

      // Adicionar filtros de preço se selecionado
      if (selectedPrice) {
        if (selectedPrice === "500+") {
          // Caso especial: acima de R$500
          filters.minPrice = 500;
          // Não definir maxPrice para buscar todos acima de 500
        } else {
          const [min, max] = selectedPrice.split("-").map(Number);
          filters.minPrice = min;
          filters.maxPrice = max;
        }
      }

      // Adicionar busca se houver termo
      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      const data = await productService.getProducts(filters);
      console.log("🚀 ~ getProducts ~ data:", data);
      setProductDetails(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getProducts();
  }, [selectedPrice, debouncedSearchTerm, currentPage, isOffersTab]);

  return (
    <IonPage>
      {/* 1. Header nativo com os botões da sua Header.tsx original */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Calvão de Cria</IonTitle>
          {/* Botões que você tinha na Header.tsx */}
          <IonButtons slot="end">
            <IonButton routerLink="/profile/settings">
              <IonIcon slot="icon-only" icon={personCircle} />
            </IonButton>
            <IonButton
              onClick={() => {
                /* Lógica para abrir carrinho */
              }}
            >
              <IonIcon slot="icon-only" icon={cart} />
              <IonBadge color="secondary">3</IonBadge>{" "}
              {/* Exemplo de contador */}
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* 2. Barra de busca nativa */}
        <IonToolbar color="primary">
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => {
              setSearchTerm(e.detail.value || "");
              setCurrentPage(1);
            }}
            placeholder="Buscar produtos..."
            debounce={500}
            className="text-white"
          />
        </IonToolbar>
      </IonHeader>

      {/* 3. Conteúdo da página (scrollável) */}
      <IonContent fullscreen>
        <div className="p-4">
          {/* Botão de Filtro (substitui o Filter.tsx lateral) */}
          <IonButton
            expand="block"
            fill="outline"
            // onClick={openFilterModal}
            className="mb-4"
          >
            <IonIcon slot="start" icon={filter} />
            Filtros
          </IonButton>

          {/* 4. Lógica de Loading */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <IonSpinner name="crescent" />
            </div>
          ) : productDetails ? (
            <>
              {/* Informações de Paginação e Total */}
              <div className="flex items-center justify-between mb-2 text-sm text-textSecondary">
                <span>
                  <b className="font-bold text-text1">
                    {productDetails?.details?.totalItems || 0}
                  </b>{" "}
                  produtos
                </span>
                {productDetails?.details && (
                  <span>
                    Página {productDetails.details.currentPage} de{" "}
                    {productDetails.details.totalPages}
                  </span>
                )}
              </div>

              {/* 5. Grid de Produtos (Mantendo Tailwind!) */}
              <div className="grid grid-cols-2 gap-4">
                {productDetails?.data?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* 6. Paginação */}
              <div className="max-w-xs mx-auto mt-6">
                <Pagination
                  changePageIndex={setCurrentPage}
                  current={currentPage}
                  total={productDetails?.details?.totalPages || 1}
                />
              </div>
            </>
          ) : (
            <div className="text-center text-textSecondary">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
// const ListProductCard = ({ product }: { product: Product }) => {
//   return (
//     <Link
//       href={`/product/${product.id}`}
//       className="bg-white flex flex-col p-4 rounded-lg shadow-md"
//     >
//       <div className="max-w-62 h-64 overflow-hidden self-center">
//         <img
//           src={product.mainImage}
//           className="object-cover"
//           alt={product.name}
//         />
//       </div>
//       <span>{product.name}</span>

//       {product.isPromotionActive ? (
//         <>
//           <span className="text-xs font-bold text-textSecondary line-through">
//             R$ {product.price.toFixed(2)}
//           </span>
//           <div className="flex gap-2 items-center font-bold">
//             <span className="text-primary text-xl">
//               R$ {product.promotionalPrice?.toFixed(2)}
//             </span>
//             <div className="text-xs bg-secondary rounded-lg text-white h-5 flex justify-center items-center px-2">
//               <span>{product.discountPercentage}% OFF</span>
//             </div>
//           </div>
//         </>
//       ) : (
//         <span className="text-xl font-bold text-primary">
//           R$ {product.price.toFixed(2)}
//         </span>
//       )}
//     </Link>
//   );
// };

import { Suspense } from "react";
import { ProductCard } from "../Home/ProductCard";

function HomeLoadingFallback() {
  return (
    <div className="flex gap-16 px-4">
      <div className="w-64 h-96 bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex-1">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Home = () => {
  return (
    <Suspense fallback={<HomeLoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
};
