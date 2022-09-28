import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import FormInput from "./Forminput";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/client/login";

const FormClientLogin = () => {
  const { setName, role, setRole, setId, setToken } = useContext(userContext);
  const [error, setError] = useState("");

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (role === "client") routeChange("/client-new-registration");
    if (role === "vet") routeChange("/employee-today-clients");
    if (role === "admin") routeChange("/schedule");
  }, [role]);

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be valid email address",
      label: "Email",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage: "Password should be 5-20 characters",
      label: "Password",
      pattern: `[a-zA-Z0-9!@#$%^&*]{5,20}$`,
      required: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newData = Object.fromEntries(data.entries());

    fetch(address, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(newData),
    })
      .then((res) => res.json())
      .then((res) => {
        // setItems(res.results);
        if (!res.err_message) {
          setError("");
          setName(res.name);
          setId(res.id);
          setToken(res.token);
          setRole(res.role);
        } else {
          setError(res.err_message);
        }
      });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h1>Client login</h1>
        {error && <div className="error">{error}</div>}
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
        <div className="form-close" onClick={() => routeChange("/")}>
          X
        </div>
      </form>
    </div>
  );
};

export default FormClientLogin;
