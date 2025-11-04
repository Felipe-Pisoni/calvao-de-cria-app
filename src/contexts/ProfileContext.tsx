"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { userService } from "../services/userService";
import { ordersService } from "../services/ordersService";
import type { User, UpdateUserData, Order } from "@/types";
import { processApiErrors } from "../utils/apiErrorUtils";

interface ProfileContextType {
  // User data
  user: User | null;
  isLoadingUser: boolean;
  userError: string | null;

  // Orders data
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;

  // Actions
  loadUserProfile: () => Promise<void>;
  loadUserOrders: () => Promise<void>;
  updateUserProfile: (data: UpdateUserData) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    try {
      setIsLoadingUser(true);
      setUserError(null);

      const userData = await userService.getProfile();
      setUser(userData);
    } catch (err) {
      console.error("Erro ao carregar perfil do usuário:", err);
      setUserError("Erro ao carregar dados do perfil");
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setOrdersError(null);

      const ordersData = await ordersService.getUserOrders();
      console.log("🚀 ~ loadUserOrders ~ ordersData:", ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setOrdersError("Erro ao carregar pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateUserProfile = async (data: UpdateUserData): Promise<boolean> => {
    try {
      setUserError(null);

      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);

      return true;
    } catch (err) {
    //   console.error("Erro ao atualizar perfil:", err);
      processApiErrors(
        err,
        (name, obj) =>
          setUserError(obj.message?.toString() || "Erro ao atualizar perfil"),
        () => {}
      );
      //   setUserError("Erro ao atualizar perfil");
      return false;
    }
  };

  const refreshData = async () => {
    await Promise.all([loadUserProfile(), loadUserOrders()]);
  };

  // Carregar dados quando o componente monta
  useEffect(() => {
    refreshData();
  }, []);

  const value: ProfileContextType = {
    user,
    isLoadingUser,
    userError,
    orders,
    isLoadingOrders,
    ordersError,
    loadUserProfile,
    loadUserOrders,
    updateUserProfile,
    refreshData,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
