import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../Layout";
const address = "http://127.0.0.1/api/admin/slots";
const addrEmployee = "http://127.0.0.1/api/employees";
const timeIntervals = [30, 25, 20, 15];
const shift = [
  { id: 1, name: "morning birds" },
  { id: 2, name: "night owl" },
];

const EmployeeSchedule = () => {
  const { token } = useContext(userContext);
  const [error, setError] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  const [message, setMessage] = useState([]);

  const [values, setValues] = useState({
    employee_id: "",
    date: "",
    min: 30,
  });

  useEffect(() => {
    fetch(addrEmployee, {
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
        setEmployeesList(res);
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
          setMessage(res.message);
        } else {
          setError(res.err_message);
        }
      });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  let today = new Date().toISOString().slice(0, 10);

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
        <h1>Add new schedule</h1>
        {error && <div className="error">{error}</div>}
        <div className="form-input">
          <label for="employee_id">Employee:</label>
          <select
            name="employee_id"
            value={values["employee_id"]}
            onChange={onChange}
            required
          >
            <option value="">--Please choose employee--</option>
            {employeesList &&
              employeesList.map((item, index) => (
                <option value={item.id} key={"emp" + index}>
                  {item.first_name + " " + item.last_name + " " + item.email}
                </option>
              ))}
          </select>
        </div>
        <div className="form-input">
          <label for="min">Choose a time interval in minutes:</label>
          <select name="min" value={values["min"]} onChange={onChange} required>
            {timeIntervals &&
              timeIntervals.map((item, index) => (
                <option value={item} key={"min" + index}>
                  {item}
                </option>
              ))}
          </select>
        </div>

        <div className="form-input">
          <label>Date</label>
          <input
            name="date"
            type="date"
            placeholder="date"
            min={today}
            required
            onChange={onChange}
          />
        </div>
        <div className="form-input">
          <label for="shift">Choose a shift:</label>
          <select
            name="shift"
            value={values["shift"]}
            onChange={onChange}
            required
          >
            <option value="">--Please choose shift--</option>
            {shift &&
              shift.map((item, index) => (
                <option value={item.id} key={"shift" + index}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default EmployeeSchedule;
