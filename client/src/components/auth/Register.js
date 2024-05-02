// src/components/Register.js
import React, { useState } from "react";
import authService from "../../services/authService";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal-user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    authService.register(username, password, role).then(
      (response) => {
        setMessage("Registration successful");
        setAlert(true);
        setLoading(false);
        // reload to EditUser component
        window.location = "/user/edit";
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-3">新增用戶</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="normal-user">Normal User</option>
                <option value="super-user">Super User</option>
              </select>
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "新增中..." : "新增"}
              </button>
            </div>
            {message 
              ? alert
                ? <div className="alert alert-primary">{message}</div>
                : <div className="alert alert-danger">{message}</div>
              : null
            }
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
