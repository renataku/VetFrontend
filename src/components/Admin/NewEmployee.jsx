import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import FormInput from "../Forms/Forminput";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/employee/create";
const addrRole = "http://127.0.0.1/api/roles";

const NewEmployee = () => {
  const { token } = useContext(userContext);
  const [error, setError] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [message, setMessage] = useState([]);

  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    role_id: "",
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
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be valid email address",
      label: "Email",
      required: true,
    },
    {
      id: 4,
      name: "position",
      type: "text",
      placeholder: "Position",
      errorMessage: "It should be valid email address",
      label: "Position",
      pattern: "^[A-Za-z0-9ĄČĘĖĮŠŲŪŽąčęėįšųūž]{3,25}$",
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
    fetch(addrRole, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          setError("");
          return res.json();
        }
        let errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setRolesList(res);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newData = Object.fromEntries(data.entries());

    fetch(address, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
      body: new URLSearchParams(newData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.err_message) {
          setMessage("");
          setMessage(res.message);
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
        {message && <div className="message">{message}</div>}
        <h1>Add new employee</h1>
        {error && <div className="error">{error}</div>}
        <select
          name="role_id"
          value={values["role_id"]}
          onChange={onChange}
          required
        >
          <option value="">--Please choose role--</option>
          {rolesList &&
            rolesList.map((item, index) => (
              <option value={item.id} key={"rol" + index}>
                {item.title}
              </option>
            ))}
        </select>

        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
        <div
          className="form-close"
          onClick={() => routeChange("/all-employees")}
        >
          X
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;
