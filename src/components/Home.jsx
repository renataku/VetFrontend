import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./UseSessionStorage";

const Home = () => {
  let navigate = useNavigate();

  const routeChange = (path) => {
    navigate(path);
  };

  return (
    <div className="form">
      <div className="home">
        <h1
          className="action"
          onClick={() => routeChange("/client-registration")}
        >
          Client registration
        </h1>
        <h1 className="action" onClick={() => routeChange("/client-login")}>
          Client login
        </h1>
        <h1 className="action" onClick={() => routeChange("/employee-login")}>
          Employee login
        </h1>
      </div>
    </div>
  );
};
export default Home;
