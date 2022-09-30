import { useState, useEffect, useContext } from "react";
import Employee from "./Employee";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/employees/all/";
const delEmployee = "http://127.0.0.1/api/employee/delete/";

const AllEmployees = () => {
  const { token } = useContext(userContext);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({ role: "all", name: "" });

  useEffect(() => {
    fetch(address, {
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
        setItems(res);
      });
  }, [message]);

  const deleteEmployee = (id) => {
    fetch(delEmployee + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          setError("");
          setMessage([]);
          return res.json();
        }
        let errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setMessage(res.message);
      });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-items">
      <div className="search-items">
        <label htmlFor="name">Find name:</label>
        <input type="text" id="name" name="name" onChange={onChange} />
        <label htmlFor="role">Choose role:</label>
        <select name="role" id="client" required onChange={onChange}>
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="vet">Vet</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <div className="form-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Role</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          {items.message && items.message}
          <tbody>
            {items &&
              !items.message &&
              [...items]
                .filter((item) => {
                  if (values.role === "all") return item;
                  if (values.role === item.role) return item;
                })
                .filter((item) =>
                  item.name
                    .toLocaleLowerCase()
                    .includes(values.name.toLocaleLowerCase())
                )
                .map((item, index) => (
                  <Employee
                    key={index}
                    item={item}
                    index={index}
                    deleteEmployee={deleteEmployee}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEmployees;
