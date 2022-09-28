import { useState, useEffect, useContext } from "react";
import { useSessionStorage } from "../UseSessionStorage";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userContext } from "../Layout";
import "./EmployeeAllPets.css";
const address = "http://127.0.0.1/api/employee/showappointment/";
const addrPet = "http://127.0.0.1/api/pet/";

const EmployeeAllPets = () => {
  const { token } = useContext(userContext);
  const [word, setWord] = useSessionStorage("word", "");
  const [items, setItems] = useState([]);
  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);

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
        var errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setItems(res);
      });
  }, [message]);

  const deletePet = (pet) => {
    fetch(addrPet + pet, {
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
        var errorText = "Something went wrong: " + res.statusText;
        setError(errorText);
      })
      .then((res) => {
        setMessage(res.message);
      });
  };

  return (
    <div className="form">
      <form>
        <div
          className="form-close"
          onClick={() =>
            routeChange(
              `/employee-${word}-clients/appointment/${params.appointmentId}`
            )
          }
        >
          Return
        </div>
        <div className="client">
          Client:{" "}
          {items.client &&
            items.client.first_name + " " + items.client.last_name}
        </div>
        <div className="form-pet-wrapper">
          {items.pets &&
            items.pets.map((item, index) => (
              <div className="form-pet" key={"pet" + index}>
                <div>{item.species.name}</div>
                <div>{item.breed.name}</div>
                <div className="name">{item.name}</div>
                <div>birth date: {item.date_of_birth}</div>
                <div>{item.gender}</div>
                <div className="links">
                  <Link
                    to={`/employee-${word}-clients/appointment/${params.appointmentId}/edit-pet/${item.id}`}
                    key={params.appointmentId}
                  >
                    Edit pet
                  </Link>
                </div>
                <button onClick={() => deletePet(item.id)}>Delete</button>
              </div>
            ))}
        </div>
      </form>
    </div>
  );
};

export default EmployeeAllPets;
