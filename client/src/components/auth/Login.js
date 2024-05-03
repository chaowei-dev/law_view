// components/Login.js
import React, { useState } from "react";
import authService from "../../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Reset message and set loading state
    setMessage("");

    // Validate form
    setLoading(true);

    // Call login service
    authService.login(username, password).then(
      // Success handling
      () => {
        // Reload the page to /cases/list
        window.location = "/cases/list";
      },
      // Error handling
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-3">登入</h2>
          <form onSubmit={handleLogin}>
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
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "登入中..." : "登入"}
              </button>
            </div>
            {message && <div className="alert alert-danger">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
