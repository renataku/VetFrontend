import "./Form.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../Layout";
import FormInput from "./Forminput";
const address = "http://127.0.0.1/api/client/register";

const Form = () => {
  const { setName, role, setRole, setId, setToken } = useContext(userContext);

  const [error, setError] = useState("");

  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const inputs = [
    {
      id: 1,
      name: "first_name",
      type: "text",
      placeholder: "First name",
      errorMessage:
        "first name should be 3-16 characters and shouldn't include any special character",
      label: "First name",
      pattern: "^[A-Za-z0-9ĄČĘĖĮŠŲŪŽąčęėįšųūž]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "last_name",
      type: "text",
      placeholder: "Last name",
      errorMessage:
        "last name should be 3-16 characters and shouldn't include any special character",
      label: "Last name",
      pattern: "^[A-Za-z0-9ĄČĘĖĮŠŲŪŽąčęėįšųūž]{3,16}$",
      required: true,
    },
    {
      id: 3,
      name: "phone",
      type: "tel",
      placeholder: "Phone",
      errorMessage: "It should be in format +370XXXXXXXX",
      label: "Phone (format: +370XXXXXXXX",
      pattern: "^(\+370)[0-9]{8}$",
      required: true,
    },
    {
      id: 4,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be valid email address",
      label: "Email",
      required: true,
    },
    {
      id: 5,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage: "Password should be 5-20 characters",
      label: "Password",
      pattern: `[a-zA-Z0-9!@#$%^&*]{5,20}$`,
      required: true,
    },
    {
      id: 6,
      name: "password_confirmation",
      type: "password",
      placeholder: "Confirm password",
      errorMessage: "Passwords don't match",
      label: "Confirm password",
      pattern: values.password,
      required: true,
    },
  ];

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (role === "client") routeChange("/client-new-registration");
    if (role === "vet") routeChange("/employee-today-clients");
    if (role === "admin") routeChange("/schedule");
  }, [role]);

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
        if (!res.err_message) {
          console.log(res);
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
        <h1>Client registration </h1>
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

export default Form;
