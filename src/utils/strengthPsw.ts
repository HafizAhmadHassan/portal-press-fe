export const getStrength = (password: string) => {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[a-z]/.test(password)) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/\d/.test(password)) s++;
  if (/[^a-zA-Z\d]/.test(password)) s++;
  return s; // 0..5
};
