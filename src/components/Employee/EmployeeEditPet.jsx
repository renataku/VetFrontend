import { useState, useEffect, useContext } from "react";
import { useSessionStorage } from "../UseSessionStorage";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "../Forms/Forminput";
import { userContext } from "../Layout";
import "./EmployeeEditPet.css";
const addressBreeds = "http://127.0.0.1/api/breeds";
const addressSpecies = "http://127.0.0.1/api/species";
const addressPet = "http://127.0.0.1/api/pet/";

const EmployeeEditPet = () => {
  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [chosenSpecies, setChosenSpecies] = useState([]);
  const { token } = useContext(userContext);
  const [word, setWord] = useSessionStorage("word", "");

  const [error, setError] = useState([]);
  const [message, setMessage] = useState([]);
  const [values, setValues] = useState({
    name: "",
    date_of_birth: "",
    breed_id: "",
  });

  let today = new Date().toISOString().slice(0, 10);

  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      placeholder: "name",
      errorMessage:
        "name should be 3-25 characters and shouldn't include any special character",
      label: "Name",
      pattern: "^[A-Za-z0-9ĄČĘĖĮŠŲŪŽąčęėįšųūž ]{3,25}$",
      required: true,
    },

    {
      id: 2,
      name: "date_of_birth",
      type: "date",
      placeholder: "date of birth",
      label: "Date of birth",
      max: today,
      required: true,
    },
  ];
  let params = useParams();
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetch(addressPet + params.petId, {
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
        setValues(res);
        setChosenSpecies(res.species.id);
      });
  }, []);

  useEffect(() => {
    fetch(addressBreeds, {
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
        setBreeds(res);
      });
  }, []);

  useEffect(() => {
    fetch(addressSpecies, {
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
        setSpecies(res);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newData = Object.fromEntries(data.entries());

    fetch(addressPet + params.petId, {
      method: "PUT",
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
          setError("");
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
        <h1>Edit pet</h1>
        {error && <div className="error">{error}</div>}
        <label>Species</label>
        <select
          value={chosenSpecies}
          onChange={(e) => setChosenSpecies(e.target.value)}
          className="pet-select"
          required="true"
        >
          <option value="">--Please choose species--</option>
          {species &&
            species.map((item, index) => (
              <option value={item.id} key={"sp" + index}>
                {item.name}
              </option>
            ))}
        </select>

        <label>Breed</label>
        <select
          name="breed_id"
          value={values["breed_id"]}
          onChange={onChange}
          className="pet-select"
          required="true"
        >
          <option value="">--Please choose breed--</option>
          {chosenSpecies &&
            breeds &&
            [...breeds]
              .filter((item) => item.species_id == chosenSpecies)
              .map((item, index) => (
                <option value={item.id} key={"br" + index}>
                  {item.name}
                </option>
              ))}
        </select>

        <label>Gender</label>
        <select
          name="gender"
          value={values["gender"]}
          onChange={onChange}
          className="pet-select"
          required="true"
        >
          <option value="">--Please choose gender--</option>

          <option value="male" key="male">
            male
          </option>
          <option value="female" key="female">
            female
          </option>
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
          onClick={() =>
            routeChange(
              `/employee-${word}-clients/appointment/${params.appointmentId}/show-all-pets`
            )
          }
        >
          X
        </div>
      </form>
    </div>
  );
};

export default EmployeeEditPet;
