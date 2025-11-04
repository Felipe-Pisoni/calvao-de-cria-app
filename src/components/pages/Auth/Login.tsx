'use client';
import { UserIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthPageWrapper, Input, Button, FormInput } from "../..";
import type { LoginData } from "@/types";
import { PasswordInput } from "@/components/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/libs/contexts/AuthContext";

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setError("");

    try {
      await login(data);
      router.push("/"); // Redireciona para home após login
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <AuthPageWrapper title="Entrar na sua conta">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <FormInput
          error={errors.email?.message}
          Input={
            <Input
              icon={<UserIcon />}
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
          error={errors.password?.message}
          Input={
            <PasswordInput
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "Senha deve ter pelo menos 6 caracteres",
                },
              })}
            />
          }
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary font-semibold cursor-pointer hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      <div className="text-center mt-4">
        <p className="text-textSecondary text-sm mb-2">
          Ainda não tem uma conta?
        </p>
        <Button href="/auth/signup" variant="secondary">
          Criar nova conta
        </Button>
      </div>
    </AuthPageWrapper>
  );
};
