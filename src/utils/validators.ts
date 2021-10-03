import validator from 'validator';

const validateName = (value: string) => (!value ? 'Nome é obrigatório' : '');

const validateEmail = (value: string) => {
  let error = '';
  if (!value) {
    error = 'Email é obrigatório';
  } else if (!validator.isEmail(value)) {
    error = 'Email inválido';
  }

  return error;
};

const validatePassword = (value: string) => {
  let error = '';
  if (!value) {
    error = 'Senha é obrigatória';
  } else if (value.length < 8 || value.length > 16) {
    error = 'Senha deve ter entre 8 e 16 carateres válidos';
  }

  return error;
};

export { validatePassword, validateEmail, validateName };
