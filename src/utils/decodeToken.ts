// utils/decodeToken.ts
export const decodeToken = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Error decodificando token:", err);
    return null;
  }
};
