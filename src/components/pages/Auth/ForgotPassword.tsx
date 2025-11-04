'use client'
import { EnvelopeIcon } from "@phosphor-icons/react";
import { AuthPageWrapper, Button, Input,  } from "../..";

export const ForgotPasswordPage = () => {
  return (
    <AuthPageWrapper title="Esqueci minha senha">
      <Input icon={<EnvelopeIcon />} placeholder="E-mail" type="email" />
      <Button href="/auth/reset-password">Gerar nova senha</Button>
      <div className="text-center mt-4">
        <Button href="/auth/login" variant="secondary">
          Voltar para login
        </Button>
      </div>
    </AuthPageWrapper>
  );
};
