import { AuthPageWrapper, Button } from "../..";
import { PasswordInput } from "@/components/Input";

export const ResetPasswordPage = () => {
  return (
    <AuthPageWrapper title="Insira sua nova senha">
      <PasswordInput />
      <PasswordInput placeholder="Confirmar nova senha" />
      <Button href="/auth/login">Confirmar nova senha</Button>
    </AuthPageWrapper>
  );
};
