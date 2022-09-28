import React, { useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "./Layout";

const addressClient = "http://127.0.0.1/api/client/logout";
const addressEmployee = "http://127.0.0.1/api/employee/logout";

const paths = [
  { path: "/", name: "Home", role: "" },
  { path: "/client-registration", name: "Client registration", role: "" },
  { path: "/client-login", name: "Client login", role: "" },
  { path: "/employee-login", name: "Employee login", role: "" },
  { path: "/client", name: "Client", role: "0" },
  {
    path: "/client-new-registration",
    name: "New registration",
    role: "client",
  },
  {
    path: "/client-all-registrations",
    name: "My Registrations",
    role: "client",
  },
  { path: "/employee", name: "Employee", role: "0" },
  { path: "/employee-today-clients", name: "My Clients Today", role: "vet" },
  { path: "/employee-all-clients", name: "My Clients (all)", role: "vet" },
  { path: "/new-employee", name: "Add new employee", role: "admin" },
  { path: "/all-employees", name: "All employees", role: "admin" },
  { path: "/schedule", name: "Add schedule", role: "admin" },
];

const Header = () => {
  const { name, setName, role, setRole, id, setId, token, setToken } =
    useContext(userContext);

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };
  useEffect(() => {
    if (role === "") routeChange("/");
  }, [role]);

  const logOut = () => {
    let address = addressEmployee;
    if (role === "client") address = addressClient;
    fetch(address, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "Loged out") {
          setName("");
          setId("");
          setToken("");
          setRole("");
        }
      });
  };

  return (
    <header>
      <ul className="menu">
        {paths
          .filter((path) => path.role === role)
          .map((path, index) => {
            return (
              <li key={index.toString()}>
                <Link to={path.path}>{path.name}</Link>
              </li>
            );
          })}
      </ul>
      {role && (
        <div className="log">
          <div>
            <div className="log-text">You are logged in as: </div>
            <div className="log-text">
              {name} - {role}
            </div>
          </div>
          <div>
            <button onClick={logOut}>Log out</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
