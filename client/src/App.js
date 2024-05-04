import "./App.css";
import React, { useEffect } from "react";

import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { VscLaw } from "react-icons/vsc";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import authService from "./services/authService";
import PrivateRoute from "./components/permission/PrivateRoute";
import SuperRoute from "./components/permission/SuperRoute";
import Users from "./components/auth/Users";
// import AlertBox from "./components/box/AlertBox";
import Cases from "./components/case/Cases";
import CaseList from "./components/case/CaseList";
import AddCase from "./components/case/AddCase";

function App() {
  const userRole = authService.getUserRole();
  const userName = authService.getUserName();
  // const [messageBox, setMessageBox] = useState("");
  // const [errorBox, setErrorBox] = useState("");

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
          <Navbar.Brand as={Link} to="/cases/view/1">
            <VscLaw />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {/* Nav Link */}
              <>
                {userRole && (
                  <>
                    <Nav.Link as={Link} to="/cases/view/1">
                      案件檢視
                    </Nav.Link>
                    <Nav.Link as={Link} to={"/cases/list/10/1"}>
                      案件列表
                    </Nav.Link>
                    <Nav.Link as={Link} to="/cases/add">
                      新增案件
                    </Nav.Link>
                  </>
                )}
              </>
              {/* Nav Link with super-user */}
              {userRole === "super-user" && (
                <>
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
          path="/cases/view/:id"
          element={
            <PrivateRoute>
              <Cases />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/list/:pageSize/:pageNum/:caseKeyword?"
          element={
            <PrivateRoute>
              <CaseList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/add"
          element={
            <PrivateRoute>
              <AddCase />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
