export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  maxLength: (field: string, max: number) =>
    `${field} must not exceed ${max} characters.`,
  invalidFormat: (field: string) => `${field} has an invalid format.`,
  isAlpha: (field: string) => `${field} must contain only letters.`,
  isEmail: () => `Email must be valid.`,
  isPhoneNumber: () => `Phone number must be valid.`,
  isUrl: (field: string) => `${field} must be a valid URL.`,
  password: () =>
    `Password must contain at least one digit, one uppercase letter, and one special character.`,
  min: (field: string, min: number) => `${field} must be at least ${min}.`,
  max: (field: string, max: number) => `${field} must not exceed ${max}.`,
};
