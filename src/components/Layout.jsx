import React from "react";
import "./Layout.css";
import Header from "./Header";
import { createContext } from "react";
import { useSessionStorage } from "./UseSessionStorage";

export const userContext = createContext();

const Layout = ({ children }) => {
  const [name, setName] = useSessionStorage("name", "");
  const [role, setRole] = useSessionStorage("role", "");
  const [id, setId] = useSessionStorage("id", "");
  const [token, setToken] = useSessionStorage("token", "");

  return (
    <div className="layout">
      <userContext.Provider
        value={{ name, setName, role, setRole, id, setId, token, setToken }}
      >
        <Header />
        <div className="content">{children}</div>
      </userContext.Provider>
    </div>
  );
};

export default Layout;
