export function saveAuth(token: string, user: object) {
  localStorage.setItem("chefconnect_token", token);
  localStorage.setItem("chefconnect_user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("chefconnect_token");
}

export function getUser() {
  const raw = localStorage.getItem("chefconnect_user");
  return raw ? JSON.parse(raw) : null;
}