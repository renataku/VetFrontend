import { useState, useEffect, useContext } from "react";
import EmployeeClient from "./EmployeeClient";
import { userContext } from "../Layout";
import { useSessionStorage } from "../UseSessionStorage";
import "./EmployeeTodayClients.css";

const address = "http://127.0.0.1/api/employee/todayclients/";

const EmployeeTodayClients = () => {
  const { id, token } = useContext(userContext);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({ client: "open", name: "" });
  const [word, setWord] = useSessionStorage("word", "");

  useEffect(() => {
    setWord("today");
  }, []);

  useEffect(() => {
    fetch(address + id, {
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
        var errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setItems(res);
      });
  }, [message]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(values);
  };

  return (
    <div className="form-items">
      <div className="search-items">
        <label htmlFor="name">Find name:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={onChange}
          value={values.name}
        />
        <label htmlFor="client">Choose clients:</label>
        <select
          name="client"
          id="client"
          required
          onChange={onChange}
          value={values.client}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <div className="form-wrapper">
        {items.message && items.message}
        <table className="table">
          <thead>
            <tr>
              <th>Date and time</th>
              <th>Name</th>
              <th>Closed</th>
              <th>Show</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              !items.message &&
              [...items]
                .filter((item) => {
                  if (values.client === "all") return item;
                  if (values.client === "open" && item.closed === 0)
                    return item;
                  if (values.client === "closed" && item.closed === 1)
                    return item;
                })
                .filter((item) =>
                  item.client_name
                    .toLocaleLowerCase()
                    .includes(values.name.toLocaleLowerCase())
                )
                .map((item, index) => (
                  <EmployeeClient item={item} index={index} />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTodayClients;
