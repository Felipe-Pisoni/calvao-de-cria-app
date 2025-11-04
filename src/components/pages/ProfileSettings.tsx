"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FormInput, PhoneInput, PhoneInputBare } from "..";
import { useProfile } from "@/libs/contexts/ProfileContext";
import { removePhoneMask, isValidPhone } from "@/libs/utils/maskUtils";
import type { UpdateUserData } from "../../types";

interface ProfileFormData {
  name: string;
  phone: string;
}

export const ProfileSettingsPage = () => {
  const { user, isLoadingUser, userError, updateUserProfile } = useProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>();

  const phoneValue = watch("phone");

  // Registrar campo de telefone customizado
  useEffect(() => {
    register("phone", {
      required: "Telefone é obrigatório",
      validate: (value) => {
        const cleanPhone = removePhoneMask(value);
        return isValidPhone(cleanPhone) || "Telefone deve ter 10 ou 11 dígitos";
      }
    });
  }, [register]);

  // Preencher formulário quando dados do usuário carregarem
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("phone", user.phone);
    }
  }, [user, setValue]);

  // Formatar data de nascimento para o formato YYYY-MM-DD
  const formatBirthDate = (birthDate: string | undefined): string => {
    if (!birthDate) return '';
    
    // Se já estiver no formato YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return birthDate;
    }
    
    // Tentar converter outros formatos comuns
    try {
      const date = new Date(birthDate);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
    }
    
    return '';
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      
      const updateData: UpdateUserData = {
        name: data.name,
        phone: removePhoneMask(data.phone),
      };

      const success = await updateUserProfile(updateData);
      
      if (success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do perfil...</p>
      </div>
    );
  }

//   if (userError) {
//     return (
//       <div className="text-center text-red-500">
//         <p>{userError}</p>
//       </div>
//     );
//   }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-text-primary border-b pb-4">
        Meus dados
      </h2>
      
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Dados atualizados com sucesso!
        </div>
      )}
      {userError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {userError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          placeholder="Nome"
          error={errors.name?.message}
          {...register("name", { 
            required: "Nome é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter pelo menos 2 caracteres"
            },
            pattern: {
              value: /^[a-zA-ZÀ-ÿ\s]+$/,
              message: "Nome deve conter apenas letras e espaços"
            }
          })}
        />
        
        <FormInput
          placeholder="Email"
          type="email"
          value={user?.email || ""}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        
        <FormInput
          placeholder="CPF"
          value={user?.cpf || ""}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        
        <FormInput
          placeholder="Data de Nascimento"
          type="date"
          value={formatBirthDate(user?.birthDate)}
          disabled
          className="bg-gray-100 cursor-not-allowed"
        />
        
        <FormInput
          error={errors.phone?.message}
          Input={
            <PhoneInputBare
              placeholder="Número de Telefone"
              value={phoneValue || ""}
              onChange={(e) => setValue("phone", e.target.value)}
            />
          }
        />

        <div className="mt-4 flex justify-end">
          <div className="w-full md:w-auto md:max-w-xs">
            <Button 
              type="submit"
              disabled={isUpdating || !isDirty}
            >
              {isUpdating ? "Salvando..." : "Salvar dados"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

