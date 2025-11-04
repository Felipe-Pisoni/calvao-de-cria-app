// Função para aplicar máscara de CEP (00000-000)
export const applyCepMask = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Aplica a máscara 00000-000
  if (cleanValue.length <= 5) {
    return cleanValue;
  } else {
    return cleanValue.slice(0, 5) + "-" + cleanValue.slice(5, 8);
  }
};

// Função para aplicar máscara de telefone (00) 00000-0000 ou (00) 0000-0000
export const applyPhoneMask = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Aplica a máscara baseada no tamanho
  if (cleanValue.length <= 2) {
    return cleanValue;
  } else if (cleanValue.length <= 6) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 10) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
      2,
      6
    )}-${cleanValue.slice(6)}`;
  } else {
    // Para celular com 11 dígitos: (00) 00000-0000
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
      2,
      7
    )}-${cleanValue.slice(7, 11)}`;
  }
};

// Função para remover máscara do CEP
export const removeCepMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Função para remover máscara do telefone
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Função para validar CEP completo
export const isValidCep = (cep: string): boolean => {
  const cleanCep = removeCepMask(cep);
  return cleanCep.length === 8;
};

// Função para validar telefone
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = removePhoneMask(phone);
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Função para aplicar máscara de CPF (000.000.000-00)
// export const applyCpfMask = (value: string): string => {
//   // Remove todos os caracteres não numéricos
//   const cleanValue = value.replace(/\D/g, "");

//   // Aplica a máscara 000.000.000-00
//   if (cleanValue.length <= 3) {
//     return cleanValue;
//   } else if (cleanValue.length <= 6) {
//     return cleanValue.slice(0, 3) + "." + cleanValue.slice(3);
//   } else if (cleanValue.length <= 9) {
//     return (
//       cleanValue.slice(0, 3) +
//       "." +
//       cleanValue.slice(3, 6) +
//       "." +
//       cleanValue.slice(6)
//     );
//   } else {
//     return (
//       cleanValue.slice(0, 3) +
//       "." +
//       cleanValue.slice(3, 6) +
//       "." +
//       cleanValue.slice(6, 9) +
//       "-" +
//       cleanValue.slice(9, 11)
//     );
//   }
// };

export const applyCpfMask = (value: string): string => {
  if (!value) return "";
  const cleanValue = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
  
  // Aplica a máscara progressivamente
  if (cleanValue.length <= 3) return cleanValue;
  if (cleanValue.length <= 6) return cleanValue.replace(/(\d{3})(\d+)/, "$1.$2");
  if (cleanValue.length <= 9) return cleanValue.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  
  // Formato completo: 000.000.000-00
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para remover máscara do CPF
// export const removeCpfMask = (value: string): string => {
//   if (!value) return "";
//   return value.replace(/\D/g, "");
// };

// maximo 11 caracteres
export const removeCpfMask = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 11);
};

// Função para validar CPF
export const isValidCpf = (cpf: string): boolean => {
  const cleanCpf = removeCpfMask(cpf);
  return cleanCpf.length === 11;
};
