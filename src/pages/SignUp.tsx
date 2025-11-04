import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  AuthPageWrapper,
  Button,
  FormInput,
  PhoneInput,
  CpfInput,
} from "../components";
import { Input, PasswordInput } from "../components/Input";
import { EnvelopeIcon, UserIcon, CalendarIcon } from "@phosphor-icons/react";
import { useAuth } from "../contexts/AuthContext";
import type { RegisterData } from "../types";
import { processApiErrors } from "../utils/apiErrorUtils";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError: setFormError,
  } = useForm<RegisterData>({
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      birthDate: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    setError("");

    try {
      await registerUser(data);
      navigate("/"); // Redireciona para home após registro
    } catch (error: any) {
      processApiErrors(error, setFormError, setError, errors);
    }
  };

  return (
    <AuthPageWrapper
      title="Criar nova conta"
      subtitle={
        <>
          Ou{" "}
          <Link className="text-primary font-semibold" to="/auth/login">
            entrar na conta
          </Link>
        </>
      }
    >
      <form
        onError={console.log}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <FormInput
          error={errors.name?.message}
          Input={
            <Input
              icon={<UserIcon />}
              placeholder="Nome completo"
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: {
                  value: 2,
                  message: "Nome deve ter pelo menos 2 caracteres",
                },
              })}
            />
          }
        />

        <FormInput
          error={errors.email?.message}
          Input={
            <Input
              icon={<EnvelopeIcon />}
              placeholder="E-mail"
              type="email"
              {...register("email", {
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "E-mail inválido",
                },
              })}
            />
          }
        />

        <FormInput
          error={errors.cpf?.message}
          Input={
            <Controller
              name="cpf"
              control={control}
              rules={{
                required: "CPF é obrigatório",
                pattern: {
                  value: /^\d{11}$/,
                  message: "CPF deve conter 11 dígitos",
                },
              }}
              render={({ field }) => (
                <CpfInput
                  placeholder="CPF"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          }
        />

        <FormInput
          error={errors.birthDate?.message}
          Input={
            <Input
              icon={<CalendarIcon />}
              placeholder="Data de nascimento"
              type="date"
              {...register("birthDate", {
                required: "Data de nascimento é obrigatória",
              })}
            />
          }
        />

        <FormInput
          error={errors.phone?.message}
          Input={
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Telefone é obrigatório",
                pattern: {
                  value: /^\d{10,11}$/,
                  message: "Telefone deve conter 10 ou 11 dígitos",
                },
              }}
              render={({ field }) => (
                <PhoneInput
                  placeholder="Telefone"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          }
        />

        <FormInput
          error={errors.password?.message}
          Input={
            <PasswordInput
              placeholder="Senha"
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 8,
                  message: "Senha deve ter pelo menos 8 caracteres",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo",
                },
              })}
            />
          }
        />

        <FormInput
          error={errors.passwordConfirm?.message}
          Input={
            <PasswordInput
              placeholder="Confirmar senha"
              {...register("passwordConfirm", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === password || "As senhas não coincidem",
              })}
            />
          }
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthPageWrapper>
  );
};
