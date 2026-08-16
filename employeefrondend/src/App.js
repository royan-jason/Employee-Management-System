import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import './App.css'
import AddEmployee from "./Components/addEmploye/AddEmployee";
import ListEmployee from "./Components/listEmploye/ListEmployee";
import Login from "./Components/login/Login";
import Register from "./Components/register/Register";
import PrivateRoute from "./Components/common/PrivateRoute";
import UnauthorizedModal from "./Components/common/UnauthorizedModal";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div >
  <BrowserRouter>
  <Header/>
  <div className="routerContainer">
  <Routes>
    <Route path="/" element={<Navigate to="/employee" replace />}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/employee" element={<PrivateRoute><ListEmployee/></PrivateRoute>}/>
    <Route path="/add-employee" element={<PrivateRoute><AddEmployee/></PrivateRoute>}/>
    <Route path="/add-employee/:id" element={<PrivateRoute><AddEmployee/></PrivateRoute>}/>
  </Routes>
  </div>
  <Footer/>
  <UnauthorizedModal/>

  </BrowserRouter>
    </div>
  );
}

export default App;
