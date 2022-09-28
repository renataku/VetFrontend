import "./ClientNewRegistration.css";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/slots-for-registrations";
const addressForRegistration = "http://127.0.0.1/api/client/registertovet";

const ClientNewRegistration = () => {
  const { id, token } = useContext(userContext);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({ name: "" });

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

  const makeAppointment = (slotId) => {
    setMessage([]);
    const regData = { slot_id: slotId, client_id: id };
    fetch(addressForRegistration, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
      body: new URLSearchParams(regData),
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
        setMessage(res.message);
      });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="form">
      <div>
        <div className="search-items">
          <label htmlFor="name">Find vet name:</label>
          <input
            className="form-items-input"
            type="text"
            id="name"
            name="name"
            onChange={onChange}
          />
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
        <div className="form-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date and time</th>
                <th>Appointment</th>
              </tr>
            </thead>
            <tbody>
              {items &&
                [...items]
                  .filter((item) =>
                    item.employee_name
                      .toLocaleLowerCase()
                      .includes(values.name.toLocaleLowerCase())
                  )
                  .sort((a, b) => (a.date_from > b.date_from ? 1 : -1))
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.employee_name}</td>
                      <td>{item.date_from}</td>
                      <td>
                        <button onClick={() => makeAppointment(item.id)}>
                          make Appointment
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientNewRegistration;
