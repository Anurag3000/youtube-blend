export const isLoggedIn = () => {
  return Boolean(localStorage.getItem("jwt"));
};

export const logout = () => {
  localStorage.removeItem("jwt");
  window.location.href = "/";
};
