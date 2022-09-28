import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Form from "./components/Forms/Form";
import FormClientLogin from "./components/Forms/FormClientLogin";
import FormEmployeeLogin from "./components/Forms/FormEmployeeLogin";
import ClientNewRegistration from "./components/Client/ClientNewRegistration";
import ClientRegistration from "./components/Client/ClientRegistration";
import EmployeeTodayClients from "./components/Employee/EmployeeTodayClients";
import EmployeeAppointment from "./components/Employee/EmployeeAppointment";
import EmployeeAddNewPet from "./components/Employee/EmployeeAddNewPet";
import NewEmployee from "./components/Admin/NewEmployee";
import EmployeeSchedule from "./components/Admin/EmployeeSchedule";
import EmployeeAllClients from "./components/Employee/EmployeeAllClients";
import AllEmployees from "./components/Admin/AllEmployees";
import EmployeeEdit from "./components/Admin/EmployeeEdit";
import EmployeeAllPets from "./components/Employee/EmployeeAllPets";
import EmployeeEditPet from "./components/Employee/EmployeeEditPet";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/client-registration", element: <Form /> },
  { path: "/client-login", element: <FormClientLogin /> },
  { path: "/employee-login", element: <FormEmployeeLogin /> },
  { path: "/client-new-registration", element: <ClientNewRegistration /> },
  { path: "/client-all-registrations", element: <ClientRegistration /> },
  { path: "/employee-today-clients", element: <EmployeeTodayClients /> },
  {
    path: "/employee-today-clients/appointment/:appointmentId",
    element: <EmployeeAppointment />,
  },
  {
    path: "/employee-today-clients/appointment/:appointmentId/add-new-pet",
    element: <EmployeeAddNewPet />,
  },
  {
    path: "/employee-today-clients/appointment/:appointmentId/edit-pet/:petId",
    element: <EmployeeEditPet />,
  },
  {
    path: "/employee-today-clients/appointment/:appointmentId/show-all-pets",
    element: <EmployeeAllPets />,
  },
  { path: "/employee-all-clients", element: <EmployeeAllClients /> },
  {
    path: "/employee-all-clients/appointment/:appointmentId",
    element: <EmployeeAppointment />,
  },
  {
    path: "/employee-all-clients/appointment/:appointmentId/add-new-pet",
    element: <EmployeeAddNewPet />,
  },
  {
    path: "/employee-all-clients/appointment/:appointmentId/edit-pet/:petId",
    element: <EmployeeEditPet />,
  },
  {
    path: "/employee-all-clients/appointment/:appointmentId/show-all-pets",
    element: <EmployeeAllPets />,
  },
  { path: "/new-employee", element: <NewEmployee /> },
  { path: "/all-employees", element: <AllEmployees /> },
  {
    path: "/all-employees/edit/:employeeId",
    element: <EmployeeEdit />,
  },
  { path: "/schedule", element: <EmployeeSchedule /> },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((routeItem, index) => {
          return (
            <Route
              key={index.toString()}
              path={routeItem.path}
              element={<Layout>{routeItem.element}</Layout>}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
