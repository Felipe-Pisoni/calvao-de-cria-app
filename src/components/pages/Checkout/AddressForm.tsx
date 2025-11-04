"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, FormInput, CepInputBare, PhoneInputBare } from "../..";
import { addressService } from "@/libs/services/addressService";
import {
  removeCepMask,
  removePhoneMask,
  isValidPhone,
} from "@/libs/utils/maskUtils";
import { processApiErrors } from "@/libs/utils/apiErrorUtils";
import type { CreateAddressData } from "@/types";
import type { AddressData } from "@/libs/services/cepService";
import { MapPinAreaIcon } from "@phosphor-icons/react";
import { useCheckout } from "@/libs/contexts/CheckoutContext";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface AddressFormData extends CreateAddressData {}

export const AddressFormPage = () => {
  const router = useRouter();
  const { id: addressId } = useParams<{ id: string }>();
  const { loadAddresses, setSelectedAddressId } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [error, setError] = useState<string>("");
  const isEditing = !!addressId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm<AddressFormData>();

  // Watch para os valores de CEP e telefone
  const cepValue = watch("cep");
  const phoneValue = watch("phone");

  // Registra os campos customizados manualmente
  useEffect(() => {
    register("cep", {
      required: "CEP é obrigatório",
      validate: (value) => {
        const cleanCep = removeCepMask(value);
        return cleanCep.length === 8 || "CEP deve ter 8 dígitos";
      },
    });
    register("phone", {
      required: "Telefone é obrigatório",
      validate: (value) => {
        const cleanPhone = removePhoneMask(value);
        return isValidPhone(cleanPhone) || "Telefone deve ter 10 ou 11 dígitos";
      },
    });
  }, [register]);

  useEffect(() => {
    console.log(isEditing, addressId);
    if (isEditing && addressId) {
      loadAddress(addressId);
    }
  }, [addressId, isEditing]);

  const loadAddress = async (id: string) => {
    try {
      setIsLoadingAddress(true);
      const address = await addressService.getAddressById(id);
      console.log("🚀 ~ loadAddress ~ address:", address);

      // Preencher o formulário com os dados do endereço
      setValue("recipientName", address.recipientName);
      setValue("alias", address.alias);
      setValue("cep", address.cep);
      setValue("street", address.street);
      setValue("number", address.number);
      setValue("complement", address.complement || "");
      setValue("neighborhood", address.neighborhood);
      setValue("city", address.city);
      setValue("state", address.state);
      setValue("phone", address.phone);
    } catch (error) {
      console.error("Erro ao carregar endereço:", error);
      alert("Erro ao carregar endereço");
      router.push("/checkout/");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      setError(""); // Limpa erros anteriores

      // Remove as máscaras antes de enviar
      const processedData = {
        ...data,
        cep: removeCepMask(data.cep),
        phone: removePhoneMask(data.phone),
      };

      if (isEditing && addressId) {
        await addressService.updateAddress(addressId, processedData);
        // Atualiza a lista de endereços
        await loadAddresses();
        // Se for edição, volta para a lista de endereços
        router.push("/checkout/");
      } else {
        const data = await addressService.createAddress(processedData);
        
        setSelectedAddressId(data.addressId);
        await loadAddresses();
        // Se for criação, vai para a próxima etapa do checkout
        router.push("/checkout/confirm");
      }
    } catch (error: any) {
      processApiErrors(error, setFormError, setError, errors);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para preencher endereço quando CEP for encontrado
  const handleAddressFound = (addressData: AddressData) => {
    setValue("street", addressData.street);
    setValue("neighborhood", addressData.neighborhood);
    setValue("city", addressData.city);
    setValue("state", addressData.state);
  };

  if (isLoadingAddress) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando endereço...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <MapPinAreaIcon className="text-textSecondary w-6 h-6" />
        {isEditing ? "Editar endereço" : "Cadastrar novo endereço"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-itemsBackground p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormInput
              placeholder="Nome do destinatário"
              error={errors.recipientName?.message}
              {...register("recipientName", {
                required: "Nome do destinatário é obrigatório",
              })}
            />
          </div>

          <FormInput
            placeholder="Nome do local"
            error={errors.alias?.message}
            {...register("alias", {
              required: "Nome do local é obrigatório",
            })}
          />

          <FormInput
            error={errors.cep?.message}
            Input={
              <CepInputBare
                isEditing={isEditing}
                placeholder="CEP"
                value={cepValue || ""}
                onChange={(value: string) => setValue("cep", value)}
                onAddressFound={handleAddressFound}
              />
            }
          />

          <FormInput
            placeholder="Rua"
            error={errors.street?.message}
            {...register("street", {
              required: "Rua é obrigatória",
            })}
          />

          <FormInput
            placeholder="Número"
            type="number"
            error={errors.number?.message}
            {...register("number", {
              required: "Número é obrigatório",
              pattern: {
                value: /^[0-9]+$/,
                message: "Número deve conter apenas dígitos",
              },
              min: {
                value: 1,
                message: "Número deve ser maior que zero",
              },
            })}
          />

          <FormInput
            placeholder="Complemento"
            error={errors.complement?.message}
            {...register("complement")}
          />

          <FormInput
            placeholder="Bairro"
            error={errors.neighborhood?.message}
            {...register("neighborhood", {
              required: "Bairro é obrigatório",
            })}
          />

          <FormInput
            placeholder="Cidade"
            error={errors.city?.message}
            {...register("city", {
              required: "Cidade é obrigatória",
            })}
          />

          <FormInput
            placeholder="Estado"
            error={errors.state?.message}
            {...register("state", {
              required: "Estado é obrigatório",
              minLength: {
                value: 2,
                message: "Estado deve ter pelo menos 2 caracteres",
              },
            })}
          />

          <FormInput
            error={errors.phone?.message}
            Input={
              <PhoneInputBare
                placeholder="Telefone"
                value={phoneValue || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue("phone", e.target.value)
                }
              />
            }
          />
        </div>

        <div className="flex gap-4 mt-6 justify-end">
          <Button
            size="small"
            variant="outline"
            type="button"
            onClick={() => router.push("/checkout/")}
          >
            Voltar
          </Button>
          <Button size="small" type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar endereço"}
          </Button>
        </div>
      </form>
    </>
  );
};
