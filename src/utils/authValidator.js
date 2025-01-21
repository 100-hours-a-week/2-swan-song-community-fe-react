export const validateEmail = email =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ? ''
    : '* 유효한 이메일을 입력하세요.';

export const validatePassword = password => {
  const isValidLength = password.length >= 8 && password.length <= 20;
  const hasNumber = /[0-9]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return isValidLength &&
    hasNumber &&
    hasUpperCase &&
    hasLowerCase &&
    hasSpecialChar
    ? ''
    : '* 비밀번호는 8자 이상 20자 이하이며, 특수문자, 영어, 숫자를 각각 하나 이상 포함해야 합니다.';
};

export const validatePasswordCheck = (password, passwordChecker) =>
  password === passwordChecker ? '' : '* 비밀번호가 일치하지 않습니다.';
