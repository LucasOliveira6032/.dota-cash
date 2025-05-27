import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuarioId, setUsuarioId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Carrega do localStorage quando app abre
    const storedId = localStorage.getItem("usuarioId");
    const storedToken = localStorage.getItem("token");

    if (storedId && storedToken) {
      setUsuarioId(parseInt(storedId));
      setToken(storedToken);
    }
  }, []);

  const login = (id, token) => {
    setUsuarioId(id);
    setToken(token);
    localStorage.setItem("usuarioId", id);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUsuarioId(null);
    setToken(null);
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ usuarioId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
