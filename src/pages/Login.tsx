import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import type { LoginData } from "../types";

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const history = useHistory();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginData) => {
    setError("");

    try {
      await login(data);
      history.push("/"); // Redireciona para home após login
    } catch (error) {
      console.error("Erro no login:", error);
      setError("Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="toolbar-primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-background">
        <div className="max-w-md mx-auto mt-8">
          {/* Card de login */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <IonTitle className="text-2xl font-semibold text-text1">
                Entrar na sua conta
              </IonTitle>
              <IonText className="text-sm text-textSecondary">
                Bem-vindo de volta!
              </IonText>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 ion-margin-bottom">
                  <IonText color="danger">
                    <p className="text-sm ion-text-center">{error}</p>
                  </IonText>
                </div>
              )}

              {/* Campo de email */}
              <IonItem
                lines="none"
                className="ion-margin-bottom bg-white border border-gray-200 rounded-lg"
              >
                <IonIcon
                  icon={mailOutline}
                  slot="start"
                  className="text-textSecondary mr-4"
                />
                <IonInput
                  type="email"
                  placeholder="E-mail"
                  value={emailValue}
                  onIonInput={(e) => setValue("email", e.detail.value || "")}
                  className="text-text1"
                />
              </IonItem>
              {errors.email && (
                <IonText color="danger">
                  <p className="text-xs ion-padding-start ion-margin-bottom">
                    {errors.email.message}
                  </p>
                </IonText>
              )}

              {/* Campo de senha */}
              <IonItem
                lines="none"
                className="ion-margin-bottom bg-white border border-gray-200 rounded-lg"
              >
                <IonIcon
                  icon={lockClosedOutline}
                  slot="start"
                  className="text-textSecondary mr-4"
                />
                <IonInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={passwordValue}
                  onIonInput={(e) => setValue("password", e.detail.value || "")}
                  className="text-text1"
                />
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ion-no-margin"
                >
                  <IonIcon
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    className="text-textSecondary"
                  />
                </IonButton>
              </IonItem>
              {errors.password && (
                <IonText color="danger">
                  <p className="text-xs ion-padding-start ion-margin-bottom">
                    {errors.password.message}
                  </p>
                </IonText>
              )}

              {/* Link esqueci minha senha */}
              <div className="ion-text-end ion-margin-bottom">
                <IonText>
                  <a
                    onClick={() => history.push("/auth/forgot-password")}
                    className="text-sm font-semibold cursor-pointer text-primary"
                  >
                    Esqueci minha senha
                  </a>
                </IonText>
              </div>

              {/* Botão de login */}
              <IonButton
                expand="block"
                type="submit"
                color="primary"
                disabled={isLoading}
                className="ion-margin-bottom"
              >
                {isLoading ? (
                  <>
                    <IonSpinner name="crescent" className="mr-2" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </IonButton>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 ion-margin-vertical">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-sm text-textSecondary">ou</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Link para criar conta */}
            <div className="ion-text-center">
              <p className="text-sm text-textSecondary ion-margin-bottom">
                Ainda não tem uma conta?
              </p>
              <IonButton
                expand="block"
                fill="outline"
                color="secondary"
                onClick={() => history.push("/auth/signup")}
              >
                Criar nova conta
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
