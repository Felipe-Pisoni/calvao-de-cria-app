import { api } from "../utils/api";

export interface CouponPreview {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  couponCode: string;
}

export interface CheckoutData {
  addressId: string;
  paymentMethodIdentifier : "pix" | "card";
  couponCode?: string;
}

export interface OrderSummary {
  orderId: string;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  address: {
    recipientName: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    phone: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export const checkoutService = {
  // Pré-visualizar aplicação de cupom
  previewCoupon: async (couponCode: string): Promise<CouponPreview> => {
    const response = await api.post("/checkout/coupon-preview", {
      couponCode,
    });
    return response.data;
  },

  // Finalizar a compra
  finalizePurchase: async (data: CheckoutData): Promise<OrderSummary> => {
    const response = await api.post("/checkout", data);
    return response.data;
  },
};
