const KEY = "ainagara_admin_token";
export const getAdminToken = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setAdminToken = (t: string) => localStorage.setItem(KEY, t);
export const clearAdminToken = () => localStorage.removeItem(KEY);
