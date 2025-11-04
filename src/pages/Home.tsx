import { useEffect, useState } from "react";
import { Filter } from "../components/Filter";
import { Link, useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import type { Product, ProductFilters, ProductsResponse } from "@/types";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/use-debouce";

export const Home = () => {
  const [searchParams] = useSearchParams();
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productDetails, setProductDetails] = useState<ProductsResponse>();
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se a aba ativa é "offers" (promoções)
  const isOffersTab = searchParams.get("tab") === "offers";

  // Capturar termo de busca da URL e resetar filtros ao mudar de aba
  useEffect(() => {
    const urlSearchTerm = searchParams.get("search");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      setCurrentPage(1); // Reset para primeira página ao buscar
    }

    // Resetar filtros ao mudar de aba
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
    <div className="flex gap-16 px-4">
      <Filter selectedPrice={selectedPrice} onPriceChange={setSelectedPrice} />
      <div className="flex flex-col flex-1 gap-6">
        {/* Barra de busca local */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar produtos na página atual..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-textSecondary hover:text-text1 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {isLoading ? (
          <>Carregando...</>
        ) : productDetails ? (
          <>
            <div className="flex items-center justify-between">
              <span>
                <b className="font-bold">
                  {productDetails?.details?.totalItems || 0}
                </b>{" "}
                produtos encontrados
                {searchTerm && (
                  <span className="text-textSecondary ml-2">
                    para "{searchTerm}"
                  </span>
                )}
                {isOffersTab && (
                  <span className="text-secondary ml-2 font-medium">
                    • Em promoção
                  </span>
                )}
              </span>
              {productDetails?.details && (
                <span className="text-sm text-textSecondary">
                  Página {productDetails.details.currentPage} de{" "}
                  {productDetails.details.totalPages}
                </span>
              )}
            </div>

            <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid flex-1">
              {productDetails?.data?.map((product: Product) => (
                <ListProductCard key={product.id} {...{ product }} />
              ))}
            </div>
            <div className="max-w-[500px] w-full self-center">
              <Pagination
                changePageIndex={setCurrentPage}
                current={currentPage}
                total={productDetails?.details?.totalPages || 1}
              />
            </div>
          </>
        ) : (
          <>Nenhum produto encontrado</>
        )}
      </div>
    </div>
  );
};
const ListProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white flex flex-col p-4 rounded-lg shadow-md"
    >
      <div className="max-w-62 h-64 overflow-hidden self-center">
        <img
          src={product.mainImage}
          className="object-cover"
          alt={product.name}
        />
      </div>
      <span>{product.name}</span>

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
    </Link>
  );
};
