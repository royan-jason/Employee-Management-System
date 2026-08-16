import React from "react";
import "./Header.css";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../service/AuthService";

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = AuthService.isAuthenticated();
  const username = AuthService.getUsername();
  const role = AuthService.getRole();

  function handleLogout() {
    AuthService.logout();
    navigate("/login");
  }

  return (
      <nav className="navbar">
        <Link to="/employee" className="navbar-brand">
          <span className="navbar-mark">EMS</span>
          <span className="navbar-title">Employee Management System</span>
        </Link>
        {isLoggedIn && (
          <div className="navbar-user">
            <span className="navbar-username">
              {username}
              <span className={`role-badge ${role === "ADMIN" ? "role-badge--admin" : "role-badge--user"}`}>
                {role === "ADMIN" ? "Admin" : "Read only"}
              </span>
            </span>
            <button className="navbar-logout" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </nav>
  )
}

export default Header
