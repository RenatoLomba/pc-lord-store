import validator from 'validator';

type Validator = (value: string, fieldName: string) => string;

const validateRequiredField: Validator = (value, fieldName) =>
  !value ? `${fieldName} é obrigatório` : '';

const validateEmail: Validator = (value, fieldName) =>
  !validator.isEmail(value) ? `${fieldName} é um email inválido` : '';

const validatePassword: Validator = (value, fieldName) =>
  value.length < 8 || value.length > 16
    ? `${fieldName} deve ter entre 8 e 16 carateres válidos`
    : '';

const validateNumeric: Validator = (value, fieldName) =>
  validator.isNumeric(value) ? '' : `${fieldName} deve conter apenas números`;

const validatePostalCode: Validator = (value, fieldName) =>
  validator.isPostalCode(value, 'BR') ? '' : `${fieldName} inválido`;

const validations = (
  value: string,
  fieldName: string,
  ...validators: Validator[]
) => {
  let error = '';

  for (let i = 0; i < validators.length; i++) {
    error = validators[i]?.(value, fieldName);
    if (error) break;
  }

  return error;
};

export {
  validatePassword,
  validateEmail,
  validateRequiredField,
  validateNumeric,
  validatePostalCode,
};

export default validations;
