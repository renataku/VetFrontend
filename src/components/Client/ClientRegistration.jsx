import { useState, useEffect, useContext } from "react";
import { userContext } from "../Layout";

const address = "http://127.0.0.1/api/client/registrations/";
const addressForCancellation =
  "http://127.0.0.1/api/client/cancel-registrations/";

const ClientRegistration = () => {
  const { id, token } = useContext(userContext);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [info, setInfo] = useState([]);
  const [items, setItems] = useState([]);

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
        setInfo([]);
        if (res.ok) {
          setError("");
          return res.json();
        }
        let errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setItems(res);
        if (res.length == 0) setInfo("You do not have any registrations");
      });
  }, [message]);

  const cancelAppointment = (appointment_id, slot_id) => {
    const cancData = { appointment_id: appointment_id, slot_id: slot_id };
    fetch(addressForCancellation + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
      body: new URLSearchParams(cancData),
    })
      .then((res) => {
        if (res.ok) {
          setError("");
          setMessage("");
          return res.json();
        }
        var errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setMessage(res.message);
      });
  };

  return (
    <div className="form-items">
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      {info && <div className="message">{info}</div>}
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
              .sort((a, b) => (a.date_from > b.date_from ? 1 : -1))
              .map((item, index) => (
                <tr key={index}>
                  <td>{item.employee_name}</td>
                  <td>{item.date_from}</td>
                  <td>
                    <button
                      onClick={() =>
                        cancelAppointment(item.appointment_id, item.slot_id)
                      }
                    >
                      cancel Appointment
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientRegistration;
