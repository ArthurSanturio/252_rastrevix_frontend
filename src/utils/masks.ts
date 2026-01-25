/**
 * Funções de máscara para campos de formulário
 */

/**
 * Aplica máscara de telefone brasileiro
 * Formato: (XX) XXXXX-XXXX para celular ou (XX) XXXX-XXXX para fixo
 * 
 * @param value - Valor a ser mascarado
 * @returns Valor com máscara aplicada
 */
export function maskPhone(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')

  // Limita a 11 dígitos (DDD + 9 dígitos para celular ou 8 para fixo)
  const limitedNumbers = numbers.slice(0, 11)

  // Se não há números, retorna vazio
  if (limitedNumbers.length === 0) {
    return ''
  }

  // Aplica a máscara baseado no tamanho
  if (limitedNumbers.length <= 2) {
    // Apenas DDD
    return `(${limitedNumbers}`
  } else if (limitedNumbers.length <= 6) {
    // DDD + início do número (fixo)
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
  } else if (limitedNumbers.length <= 10) {
    // DDD + número completo (fixo)
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`
  } else {
    // DDD + número completo (celular com 9 dígitos)
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`
  }
}

/**
 * Remove a máscara do telefone, retornando apenas números
 * 
 * @param value - Valor com máscara
 * @returns Apenas números
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Valida se o telefone está no formato correto
 * 
 * @param phone - Telefone a ser validado
 * @returns true se válido, false caso contrário
 */
export function validatePhone(phone: string): boolean {
  const unmasked = unmaskPhone(phone)
  
  // Deve ter 10 ou 11 dígitos (DDD + 8 ou 9 dígitos)
  if (unmasked.length < 10 || unmasked.length > 11) {
    return false
  }
  
  // Rejeitar DDD 00
  const ddd = unmasked.substring(0, 2)
  if (ddd === '00') {
    return false
  }
  
  // Rejeitar números com todos zeros ou muitos zeros consecutivos
  if (unmasked === '0'.repeat(unmasked.length) || unmasked.includes('000000')) {
    return false
  }
  
  return true
}
