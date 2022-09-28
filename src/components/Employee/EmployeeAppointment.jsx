import { useSessionStorage } from "../UseSessionStorage";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userContext } from "../Layout";
import "./EmployeeAppointment.css";

const address = "http://127.0.0.1/api/employee/showappointment/";
const addrUpd = "http://127.0.0.1/api/employee/updateappointment/";
const addrShowHist = "http://127.0.0.1/api/employee/showhistoryappointment/";

const EmployeeAppointment = () => {
  const { token } = useContext(userContext);
  const [word, setWord] = useSessionStorage("word", "");

  const [error, setError] = useState([]);
  const [inputError, setInputError] = useState([]);
  const [message, setMessage] = useState([]);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [pet, setPet] = useState("");
  const [description, setDescription] = useState("");
  const [closed, setClosed] = useState(0);

  let params = useParams();

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetch(address + params.appointmentId, {
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

  useEffect(() => {
    if (!items.appointment) return;
    if (!items.appointment.pet_id) return;
    fetch(addrShowHist + params.appointmentId, {
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
        setHistory(res);
      });
  }, [items]);

  useEffect(() => {
    if (items.appointment) {
      setPet(items.appointment.pet_id);
      setDescription(items.appointment.description);
      setClosed(items.appointment.closed);
    }
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputError("");
    if (!e.target.pet.value) {
      setInputError("choose the pet, please");
      return null;
    }
    if (e.target.closed.value === 1 && e.target.description.value === "") {
      setInputError("add a description, please");
      return null;
    }

    if (e.target.description.value === "")
      e.target.description.value = "no description";
    updateAppointment(
      e.target.pet.value,
      e.target.description.value,
      e.target.closed.value
    );
  };

  const updateAppointment = (pet, description, closed) => {
    setMessage([]);
    const updData = { pet_id: pet, description: description, closed: closed };
    fetch(addrUpd + params.appointmentId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + token,
      },
      body: new URLSearchParams(updData),
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

  return (
    <div className="forms-wrapper">
      <div className="form">
        <form onSubmit={handleSubmit}>
          {items.client && (
            <>
              <h1>{items.client.first_name + " " + items.client.last_name}</h1>
              {inputError && <div className="error">{inputError}</div>}
              <p>{items.appointment.slot.date_from}</p>
              <p>{items.client.email}</p>
              <p>{items.client.phone}</p>
            </>
          )}
          <select
            name="pet"
            value={pet}
            onChange={(e) => setPet(e.target.value)}
          >
            <option value="">--Please choose a pet--</option>
            {items.pets &&
              items.pets.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name} ({item.breed.name} - {item.species.name})
                </option>
              ))}
          </select>
          <p>
            <label htmlFor="description">Description:</label>
          </p>
          <textarea
            id="description"
            name="description"
            rows="6"
            cols="30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div>
            <select
              name="closed"
              value={closed}
              onChange={(e) => setClosed(e.target.value)}
            >
              <option value="0">opened case</option>
              <option value="1">closed case</option>
            </select>
          </div>
          <div className="links">
            <Link
              to={`/employee-${word}-clients/appointment/${params.appointmentId}/add-new-pet`}
              key={params.appointmentId}
            >
              Add new pet
            </Link>

            <Link
              to={`/employee-${word}-clients/appointment/${params.appointmentId}/show-all-pets`}
            >
              Show all pets
            </Link>
          </div>
          <button>Submit / Show history</button>
          <div
            className="form-close"
            onClick={() => routeChange(`/employee-${word}-clients/`)}
          >
            X
          </div>
        </form>
      </div>
      <div className="form">
        <form>
          <h1>History</h1>
          {history[0] && <h3>{history[0].pet_name}</h3>}
          <div className="history">
            {history &&
              [...history]
                .sort((a, b) => (a.date_from < b.date_from ? 1 : -1))
                .map((item, index) => (
                  <div key={"d" + index}>
                    <div className="history-date">
                      {item.date_from} {item.employee}
                    </div>
                    <div className="history-date">{item.description}</div>
                  </div>
                ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAppointment;
