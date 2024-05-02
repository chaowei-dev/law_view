import "./App.css";
import React, { useEffect, useState } from "react";

import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Books from "./components/book/Books";
import CreateBook from "./components/book/CreateBook";
import authService from "./services/authService";
import PrivateRoute from "./components/permission/PrivateRoute";
import SuperRoute from "./components/permission/SuperRoute";
import Users from "./components/auth/Users";
import AlertBox from "./components/box/AlertBox";
import Cases from "./components/case/Cases";
import CaseList from "./components/case/CaseList";

function App() {
  const userRole = authService.getUserRole();
  const userName = authService.getUserName();
  const [messageBox, setMessageBox] = useState("");
  const [errorBox, setErrorBox] = useState("");

  // Auto logout when token is expired
  // Check every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(authService.checkTokenExpiration, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      {/* Nav bar */}
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/cases/view">
            Library System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {/* Nav Link */}
              <>
                {userRole && (
                  <>
                    <Nav.Link as={Link} to="/cases/view">
                      案件檢視
                    </Nav.Link>
                    <Nav.Link as={Link} to="/cases/list">
                      案件列表
                    </Nav.Link>
                  </>
                )}
              </>
              {/* Nav Link with super-user */}
              {userRole === "super-user" && (
                <>
                  {/* <Nav.Link as={Link} to="/books/create">
                    新增書目
                  </Nav.Link> */}
                  <NavDropdown title="用戶管理" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/register">
                      新增用戶
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/user/edit">
                      編輯用戶
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>

            {/* Auth Status */}
            <Nav>
              {userRole ? (
                <>
                  <Navbar.Text className="fw-bold text-primary mr-3">
                    使用者: {userName}
                  </Navbar.Text>

                  <Nav.Link onClick={authService.logout}>登出</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    登入
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Alert Box */}
      {/* <AlertBox
        messageBox={messageBox}
        setMessageBox={setMessageBox}
        errorBox={errorBox}
        setErrorBox={setErrorBox}
      /> */}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <SuperRoute>
              <Register />
            </SuperRoute>
          }
        />
        <Route
          path="/user/edit"
          element={
            <SuperRoute>
              <Users />
            </SuperRoute>
          }
        />
        <Route
          path="/cases/view"
          element={
            <PrivateRoute>
              <Cases />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/list"
          element={
            <PrivateRoute>
              <CaseList />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/cases"
          element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          }
        /> */}
        {/* <Route path="/books/create" element={<CreateBook />} /> */}
        {/* More routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
