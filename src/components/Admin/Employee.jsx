import { Link } from "react-router-dom";

const Employee = ({ item, index, deleteEmployee }) => {
  return (
    <>
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.position}</td>
        <td>{item.role}</td>
        <td>
          <Link to={`/all-employees/edit/${item.id}`} key={item.id}>
            Edit
          </Link>
        </td>
        <td>
          <button onClick={() => deleteEmployee(item.id)}>Delete</button>
        </td>
      </tr>
    </>
  );
};

export default Employee;
