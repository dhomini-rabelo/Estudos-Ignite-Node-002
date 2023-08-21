/* eslint-disable */

export enum ErrorMessages {
  REQUIRED = 'Preencha este campo',
  REQUIRED_SELECT = 'Selecione um item',
  INVALID_VALUE = 'Valor inválido',
  INVALID_EMAIL = 'Email inválido',
  INVALID_FORMAT = 'Formato inválido',
  INVALID_CHOICE = 'Opção inválida',
  INVALID_SLUG = 'Use apenas letras, números ou "-, @, ., _"',
}

/* eslint-enable */

export const DynamicErrorMessages = {
  equalLength: (lengthValue: number) => `Use ${lengthValue} letras`,
  minLength: (minLengthValue: number) =>
    `Use mais que ${minLengthValue} letras`,
  maxLength: (maxLengthValue: number) =>
    `Use menos que ${maxLengthValue} letras`,
  minValue: (minValueNumber: number) =>
    `O valor mínimo deve ser ${minValueNumber}`,
  maxValue: (maxValueNumber: number) =>
    `O valor máximo deve ser ${maxValueNumber}`,
} as const
