import './App.css';

import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { VscLaw } from 'react-icons/vsc';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import authService from './services/authService';
import PrivateRoute from './components/permission/PrivateRoute';
import Users from './components/auth/Users';
// import AlertBox from "./components/box/AlertBox";
import Cases from './components/case/Cases';
import CaseList from './components/case/CaseList';
import AddCase from './components/case/AddCase';
import KeywordView from './components/keyword/KeywordView';
import MarkCase from './components/case/MarkCase';

function App() {
  const userRole = authService.getUserRole();
  const userName = authService.getUserName();
  const isLogin = !authService.isTokenExpired();
  // const [messageBox, setMessageBox] = useState("");
  // const [errorBox, setErrorBox] = useState("");

  // Auto logout when token is expired
  // Check every 5 minutes
  // useEffect(() => {
  //   const intervalId = setInterval(authService.checkTokenExpiration, 60000);
  //   return () => clearInterval(intervalId);
  // }, []);

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
                {isLogin && userRole && (
                  <>
                    <Nav.Link as={Link} to="/cases/view/1">
                      案件檢視
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to={'/cases/list/100/1/jid=&remarks=&jfull='}
                    >
                      案件列表
                    </Nav.Link>
                  </>
                )}
              </>
              {/* Nav Link with super-user */}
              {isLogin && userRole === 'super-user' && (
                <>
                  <Nav.Link as={Link} to="/cases/add">
                    新增案件
                  </Nav.Link>
                  <Nav.Link as={Link} to="/cases/mark">
                    標記案件
                  </Nav.Link>
                  <Nav.Link as={Link} to="/keyword">
                    關鍵字
                  </Nav.Link>
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
              {isLogin && userRole ? (
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
        <Route path="/" element={<Navigate to="/cases/view/1" />} />
        <Route path="/login" element={<Login />} />
        {/* Super user auth */}
        <Route
          path="/register"
          element={
            <PrivateRoute allowedUser={['super-user']}>
              <Register />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/edit"
          element={
            <PrivateRoute allowedUser={['super-user']}>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/add"
          element={
            <PrivateRoute allowedUser={['super-user']}>
              <AddCase />
            </PrivateRoute>
          }
        />
        <Route
          path="/keyword"
          element={
            <PrivateRoute allowedUser={['super-user']}>
              <KeywordView />
            </PrivateRoute>
          }
        />
        <Route 
         path="/cases/mark"
          element={
            <PrivateRoute allowedUser={['super-user']}>
              <MarkCase />
            </PrivateRoute>
          }
        />
        {/* Normal user auth */}
        <Route
          path="/cases/view/:id"
          element={
            <PrivateRoute allowedUser={['super-user', 'user']}>
              <Cases />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/list/:pageSize/:pageNum/:caseKeyword?"
          element={
            <PrivateRoute allowedUser={['super-user', 'user']}>
              <CaseList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
