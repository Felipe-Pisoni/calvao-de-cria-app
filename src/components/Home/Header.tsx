"use client";

import { LogoIcon } from "../LogoIcon";

import React, { useRef } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonPopover,
  IonList,
  IonItem,
} from "@ionic/react";
// Importamos os ícones do Ionic
import { cart, personCircle, person, list, logOut } from "ionicons/icons";

// As props são as mesmas do seu Header.tsx original
interface IonicHeaderProps {
  toggleDrawer: () => void;
}

export const IonicHeader: React.FC<IonicHeaderProps> = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();

  // Ref para o Popover (substitui seu useState e useEffect de 'click outside')
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  // --- Lógica dos Tabs (igual ao original) ---
  const activeTabKey = searchParams.get("tab") || "products";

  const handleTabClick = (e: CustomEvent) => {
    const key = e.detail.value;
    if (key === "products") {
      navigate("/");
    } else if (key === "offers") {
      navigate("/?tab=offers");
    }
  };

  // --- Lógica do Carrinho (igual ao original) ---
  const cartItemsCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // --- Lógica do Menu de Usuário (adaptada para Popover) ---
  const onMenuClick = (path: string) => {
    navigate(path);
    popoverRef.current?.dismiss(); // Fecha o popover
  };

  const onLogoutClick = () => {
    logout();
    popoverRef.current?.dismiss();
  };

  const handleUserIconClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
    // Se estiver logado, o popover abre automaticamente
    // pois o IonButton tem o id="user-menu-trigger"
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        {/* 1. Logo (Slot Start) */}
        <IonButtons slot="start">
          <div className="pl-2">
            {/* Seu componente LogoIcon original funciona perfeitamente */}
            <LogoIcon />
          </div>
        </IonButtons>

        {/* 2. Tabs (Slot Center/Title) */}
        {/* Usamos IonTitle para centralizar o IonSegment */}
        <IonTitle>
          <IonSegment
            value={activeTabKey}
            onIonChange={handleTabClick}
            className="w-auto md:w-64 mx-auto" // Tailwind para largura
          >
            <IonSegmentButton value="products">
              {/* Adicionamos text-white para bater com seu CSS original */}
              <IonLabel className="text-white font-semibold">Produtos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="offers">
              <IonLabel className="text-white font-semibold">
                Promoções
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonTitle>

        {/* 3. Ícones (Slot End) */}
        <IonButtons slot="end">
          {/* --- Botão do Menu de Usuário --- */}
          <IonButton id="user-menu-trigger" onClick={handleUserIconClick}>
            {isAuthenticated && user ? (
              // Replicando seu avatar com Tailwind
              <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name
                  ?.split(" ")
                  .map((x) => x[0])
                  .join("")}
              </div>
            ) : (
              // Ícone padrão do Ionic
              <IonIcon
                slot="icon-only"
                icon={personCircle}
                className="text-white"
              />
            )}
          </IonButton>

          {/* --- Popover do Menu de Usuário (substitui seu dropdown) --- */}
          <IonPopover
            ref={popoverRef}
            trigger="user-menu-trigger" // ID do botão que o aciona
            triggerAction="click" // Aciona com clique
            dismissOnSelect={false} // Não fecha ao clicar (controlamos manualmente)
          >
            <IonList>
              <IonItem button onClick={() => onMenuClick("/profile/settings")}>
                <IonIcon icon={person} slot="start" />
                <IonLabel>Meu Perfil</IonLabel>
              </IonItem>
              <IonItem button onClick={() => onMenuClick("/profile/orders")}>
                <IonIcon icon={list} slot="start" />
                <IonLabel>Meus Pedidos</IonLabel>
              </IonItem>
              <IonItem lines="none" button onClick={onLogoutClick}>
                <IonIcon icon={logOut} slot="start" color="danger" />
                <IonLabel color="danger">Sair</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>

          {/* --- Botão do Carrinho --- */}
          <IonButton onClick={toggleDrawer} className="relative pr-2">
            <IonIcon slot="icon-only" icon={cart} className="text-white" />
            {cartItemsCount > 0 && (
              // Replicando seu badge com Tailwind
              <IonBadge
                color="secondary"
                className="absolute -top-1 -right-0 text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {cartItemsCount > 9 ? "9+" : cartItemsCount}
              </IonBadge>
            )}
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

import { Suspense } from "react";
import { useIonRouter } from "@ionic/react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

interface HeaderProps {
  toggleDrawer: () => void;
}

function HeaderSkeleton() {
  return (
    <div className="p-4 w-full h-16 bg-primary shadow-md flex justify-center">
      <div className="w-full max-w-7xl flex justify-between items-center">
        <div className="w-12 h-8 bg-white/20 rounded animate-pulse" />
        <div className="flex gap-12">
          <div className="w-20 h-6 bg-white/20 rounded animate-pulse" />
          <div className="w-24 h-6 bg-white/20 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent toggleDrawer={toggleDrawer} />
    </Suspense>
  );
};
