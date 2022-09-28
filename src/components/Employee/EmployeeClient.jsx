import { Link } from "react-router-dom";
import { useSessionStorage } from "../UseSessionStorage";

const EmployeeTodayClient = ({ item, index }) => {
  const [word, setWord] = useSessionStorage("word", "");
  return (
    <tr key={"row" + index}>
      <td>{item.date_from}</td>
      <td>{item.client_name}</td>
      <td>{item.closed ? "Yes" : "No"}</td>
      <td>
        <Link
          to={`/employee-${word}-clients/appointment/${item.appointment_id}`}
          key={item.appointment_id}
        >
          Show info
        </Link>
      </td>
    </tr>
  );
};

export default EmployeeTodayClient;
