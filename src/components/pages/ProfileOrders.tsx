"use client";
import { useProfile } from "@/libs/contexts/ProfileContext";
import type { Order, OrderItem } from "../../types";

interface OrderItemComponentProps {
  item: OrderItem;
}

const OrderItemComponent = ({ item }: OrderItemComponentProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-4">
      <img
        src={item.mainImageUrl || "https://via.placeholder.com/64"}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-md border"
      />
      <div>
        <p className="text-sm text-text-primary">{item.name}</p>
        <p className="text-xs text-text-secondary">
          Quantidade: {item.quantity} x R${" "}
          {item.priceAtTimeOfPurchase.toFixed(2)}
        </p>
      </div>
    </div>
    <span className="font-bold text-primary">
      R$ {item.totalItemPrice.toFixed(2)}
    </span>
  </div>
);

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PREPARING_SHIPMENT: "Preparando Envio",
      PAID: "Pago",
      PENDING: "Pendente",
      AWAITING_PAYMENT: "Aguardando Pagamento",
      PROCESSING: "Processando",
      SHIPPED: "Enviado",
      DELIVERED: "Entregue",
      CANCELED: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      PREPARING_SHIPMENT: "text-blue-600",
      PAID: "text-green-600",
      PENDING: "text-yellow-600",
      AWAITING_PAYMENT: "text-orange-600",
      PROCESSING: "text-blue-600",
      SHIPPED: "text-purple-600",
      DELIVERED: "text-green-600",
      CANCELLED: "text-red-600",
    };
    return colorMap[status] || "text-gray-600";
  };

  return (
    <div className="pb-6 mb-6 bg-white p-4 rounded-md shadow-sm">
      <div className="grid grid-cols-4 gap-4 mb-3 border-b border-textSecondary pb-3">
        <div className='flex items-center flex-col justify-center'>
          <h3 className="text-sm text-text-secondary">Pedido realizado em</h3>
          <p className="font-semibold">
            {formatDate(order.createdAt)}, {formatTime(order.createdAt)}
          </p>
        </div>
        
        <div className='flex items-center flex-col'>
          <h3 className="text-sm text-text-secondary">Status</h3>
          <p className={`font-semibold ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </p>
        </div>
        <div className='flex items-center flex-col'>
          <h3 className="text-sm text-text-secondary">Endereço de entrega</h3>
          <p className="text-sm">
            {order.shippingAddress.recipientName}
            <br />
            {order.shippingAddress.city} - {order.shippingAddress.state}
          </p>
        </div>
        <div className='flex items-center flex-col'>
          <h3 className="text-sm text-text-secondary">Código do pedido</h3>
          <p className="font-semibold">#{order.orderNumber}</p>
        </div>
      </div>

      <h4 className="font-semibold text-text-primary mb-2">Itens do pedido</h4>
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <OrderItemComponent key={`${item.productId}-${index}`} item={item} />
        ))}
      </div>

      <div className="flex justify-end items-center mt-3 pt-2 border-textSecondary border-t">
        <span className="text-text-secondary mr-4">Total</span>
        <span className="text-xl font-bold text-text-primary">
          R$ {order.totals.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const ProfileOrdersPage = () => {
  const { orders, isLoadingOrders, ordersError, refreshData } = useProfile();

  if (isLoadingOrders) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="text-center text-red-500">
        <p>{ordersError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2
        onDoubleClick={refreshData}
        className="text-xl font-semibold text-text-primary border-b pb-4 mb-4"
      >
        Meus pedidos
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary mb-4">
            Você ainda não fez nenhum pedido
          </p>
          <a href="/" className="text-primary font-semibold hover:underline">
            Continuar comprando
          </a>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
