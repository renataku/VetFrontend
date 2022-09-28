import { useState, useEffect, useContext } from "react";
import { useSessionStorage } from "../UseSessionStorage";
import EmployeeClient from "./EmployeeClient";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/employee/allclients/";

const EmployeeAllClients = () => {
  const { id, token } = useContext(userContext);
  const [word, setWord] = useSessionStorage("word", "");
  const [error, setError] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({ client: "all", name: "" });
  useEffect(() => {
    setWord("all");
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
  }, []);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="form-items">
      <div className="search-items">
        <label htmlFor="name">Find name:</label>
        <input
          className="form-items-input"
          type="text"
          id="name"
          name="name"
          onChange={onChange}
        />
        <label htmlFor="client">Choose clients:</label>
        <select name="client" id="client" required onChange={onChange}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="form-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date and time</th>
              <th>Name</th>
              <th>Closed</th>
              <th>Show</th>
            </tr>
          </thead>
          {items.message && items.message}
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

export default EmployeeAllClients;
