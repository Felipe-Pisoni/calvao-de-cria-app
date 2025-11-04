import type { UseFormSetError, FieldErrors, Path } from "react-hook-form";

/**
 * Processa erros de API e aplica aos campos do formulário
 * @param error - Erro retornado pela API
 * @param setFormError - Função setError do react-hook-form
 * @param setGeneralError - Função para definir erro geral
 * @param currentErrors - Erros atuais do formulário para limpeza
 */
export function processApiErrors<TFieldValues extends Record<string, any>>(
  error: any,
  setFormError: UseFormSetError<TFieldValues>,
  setGeneralError: (message: string) => void,
  currentErrors?: FieldErrors<TFieldValues>
) {
  console.error("Erro da API:", error);
  
  // Limpa erro geral anterior
  setGeneralError("");
  
  // Verifica se o erro tem a estrutura esperada da API
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const apiErrors = error.response.data.errors;
    console.log("📋 Erros da API:", apiErrors);
    console.log('reann')
    
    // Limpa erros de servidor anteriores
    if (currentErrors) {
      Object.keys(currentErrors).forEach(field => {
        if (currentErrors[field as keyof TFieldValues]?.type === 'server') {
          setFormError(field as Path<TFieldValues>, { type: "server", message: "" });
        }
      });
    }
    
    // Processa cada erro da API
    apiErrors.forEach((errorObj: Record<string, string>) => {
      Object.keys(errorObj).forEach((field) => {
        console.log(`⚠️ Erro no campo ${field}: ${errorObj[field]}`);
        // Define o erro no campo específico do formulário
        setFormError(field as Path<TFieldValues>, {
          type: "server",
          message: errorObj[field]
        });
      });
    });
    
    // Mensagem geral se houver
    if (error.response.data.message) {
      setGeneralError(error.response.data.message);
    }
  } else {
    // Se não tem a estrutura esperada, mostra erro genérico
    console.log("❌ Erro sem estrutura padrão:", error);
    setGeneralError("Erro inesperado. Verifique os dados e tente novamente.");
  }
}