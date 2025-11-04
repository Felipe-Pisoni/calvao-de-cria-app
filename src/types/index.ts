// export interface Product {
//   id: number;
//   name: string;
//   price: number;
//   oldPrice: number;
//   discount: number;
//   image: string;
//   description?: string;
//   features?: string[];
//   category?: string;
//   brand?: string;
//   images?: string[];
// }
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  promotionalPrice?: number;
  isPromotionActive: boolean;
  discountPercentage?: number;
  mainImage: string;
  images?: string[];
  rating: number;
  stockQuantity: number;
  category?: string;
  brand?: string;
}

export interface CartItem {
  mainImageUrl: string;
  name: string;
  price: number;
  productId: string;
  promotionalPrice: number;
  quantity: number;
  totalItemPrice: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
  guestCartId?: string;
}

export interface Address {
  addressId: string;
  alias: string;
  recipientName: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
}

export interface CreateAddressData {
  alias: string;
  recipientName: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

export interface PriceRange {
  label: string;
  value: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  // Email, CPF e data de nascimento normalmente não são editáveis
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  mainImageUrl?: string;
  quantity: number;
  priceAtTimeOfPurchase: number;
  totalItemPrice: number;
}
export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  shippingAddress: OrderAddress;
  items: OrderItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  paymentMethod: string;
  paymentInfo?: {
    type: string;
    qrCodeImage?: string;
    copyPasteCode?: string;
  };
}

export interface OrderAddress {
  recipientName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
}



export interface OrdersResponse {
  status: string;
  message: string;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: Order[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  status: string;
  data: AuthResponseData;
}
export interface AuthResponseData {
  email: string;
  name: string;
  userId: string;
  tokens: AuthTokens;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
}

// Product Search & Filter Types
export interface ProductFilters {
  search?: string;
  inPromotion?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "name" | "rating";
  order?: "asc" | "desc";
}

export interface ProductsResponse {
  status: string;
  message: string;
  details: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: Product[];
}

// Cart Types
export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateCartItem: (
    productId: string,
    data: UpdateCartItemData
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  getCart: () => Promise<void>;
  clearCart: () => void;
}

