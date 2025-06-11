// source: https://github.com/tiagoporto/gerador-validador-cpf
export const generateDocument = (): string => {
  const firstNineDigits = generateDigits()
  const generatedCPF = `${firstNineDigits}${calcCheckDigits(firstNineDigits)}`
  return generatedCPF
}

export const generateDigits = () => {
  let digits = ''
  do {
    if (digits.length === 9) digits = ''
    for (let i = 0; i < 9; ++i) {
      digits += String(Math.floor(Math.random() * 10))
    }
  } while (allSameCharacters(digits))
  return digits
}

export const allSameCharacters = (string_: string) => {
  for (let i = 1; i < string_.length; i++) {
    if (string_[i] !== string_[0]) return false
  }
  return true
}

export const calcCheckDigits = (cpf: string) => {
  const IMPORTANCE_ARRAY = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
  let sumFirstCheckDigit = 0
  let sumSecondCheckDigit = 0
  for (let i = 0; i < 9; ++i) {
    sumFirstCheckDigit += Number(cpf[i]) * IMPORTANCE_ARRAY[i + 1]
    sumSecondCheckDigit += Number(cpf[i]) * IMPORTANCE_ARRAY[i]
  }
  const remainerFirstCheckDigit = sumFirstCheckDigit % 11
  const firstCheckDigit = remainerFirstCheckDigit < 2 ? 0 : 11 - remainerFirstCheckDigit
  sumSecondCheckDigit += firstCheckDigit * IMPORTANCE_ARRAY[9]
  const remainerSecondCheckDigit = sumSecondCheckDigit % 11
  const secondCheckDigit = remainerSecondCheckDigit % 11 < 2 ? 0 : 11 - (remainerSecondCheckDigit % 11)
  return `${firstCheckDigit}${secondCheckDigit}`
}
