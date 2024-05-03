import React, { useState, useEffect } from "react";
import authService from "../../services/authService";
import EditUser from "./EditUser";
import { Dropdown, Modal, Button } from "react-bootstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingShow, setEditingShow] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // To track which user is being edited
  const [deletingConfirmShow, setDeletingConfirmShow] = useState(false);
  const [changePasswordShow, setChangePasswordShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorBox, setPasswordErrorBox] = useState("");
  const [errorBox, setErrorBox] = useState("");
  const [messageBox, setMessageBox] = useState("");

  // Get the user from local storage
  const userRole = authService.getUserRole();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    let messageTimer, errorTimer;

    // Clear messageBox after 3 seconds if it's not empty
    if (messageBox !== "") {
      messageTimer = setTimeout(() => {
        setMessageBox("");
      }, 3000);
    }

    // Clear errorBox after 3 seconds if it's not empty
    if (errorBox !== "") {
      errorTimer = setTimeout(() => {
        setErrorBox("");
      }, 3000);
    }

    // Cleanup function to clear timers when the component unmounts or the variables change
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(errorTimer);
    };
  }, [messageBox, errorBox]); // Depend on both messageBox and errorBox

  // FETCHING
  const fetchUsers = () => {
    authService
      .getUserList()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // DELETION
  // Click delete button
  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setDeletingConfirmShow(true);
  };
  // Click cancel delete
  const handleCancelDelete = () => {
    setDeletingConfirmShow(false);
  };
  // Click confirm delete
  const handleConfirmDelete = () => {
    if (currentUser) {
      authService
        .deleteUser(currentUser.id)
        .then(() => {
          setUsers(users.filter((user) => user.id !== currentUser.id));
          setDeletingConfirmShow(false);
          setCurrentUser(null);
          setMessageBox("User deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setErrorBox("Failed to delete user.");
        });
    }
  };

  // EDITING
  const handleEditClick = (user) => {
    setCurrentUser(user);
    setEditingShow(true);
  };

  // PASSWORD CHANGE
  // 1. Click change password
  const handleChangePasswordClick = (user) => {
    setCurrentUser(user);
    setChangePasswordShow(true);
    setNewPassword("");
    setConfirmPassword("");
  };
  // 2. Click cancel change password
  const handleCancelChangePassword = () => {
    setChangePasswordShow(false);
    setPasswordErrorBox("");
  };
  // 3. Confirm newPassword === confirmPassword
  const handleConfirmChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordErrorBox("Passwords do not match.");
      return;
    }

    authService
      .changePassword(currentUser.username, newPassword)
      .then(() => {
        setChangePasswordShow(false);
        setCurrentUser(null);
        setMessageBox("Password changed successfully.");
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        setErrorBox("Failed to change password.");
      });
  };

  return (
    <div className="container mt-3">
      <h2>User List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            {userRole === "super-user" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              {userRole === "super-user" && (
                <td>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      size="sm"
                      id="dropdown-basic"
                    >
                      Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEditClick(user)}>
                        Edit User
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleChangePasswordClick(user)}
                      >
                        Change Password
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteClick(user)}>
                        Delete User
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editingShow && currentUser && (
        <EditUser
          show={editingShow}
          onHide={() => setEditingShow(false)}
          user={currentUser}
          onSave={fetchUsers}
          setMessageBox={setMessageBox}
          setErrorBox={setErrorBox}
        />
      )}
      {/* Change Password Modal */}
      {changePasswordShow && currentUser && (
        <Modal
          show={changePasswordShow}
          onHide={handleCancelChangePassword}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {/* Error Password Box */}
            {passwordErrorBox && (
              <div class="alert alert-danger" role="alert">
                {passwordErrorBox}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={handleCancelChangePassword}
            >
              Close
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleConfirmChangePassword}
            >
              Change Password
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Delete Modal */}
      {deletingConfirmShow && currentUser && (
        <Modal show={deletingConfirmShow} onHide={handleCancelDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Delete "${currentUser.username}"?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCancelDelete}>
              Close
            </Button>
            <Button variant="outline-danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Success Box */}
      {messageBox && (
        <div class="alert alert-success" role="alert">
          {messageBox}
        </div>
      )}
      {/* Error Box */}
      {errorBox && (
        <div class="alert alert-danger" role="alert">
          {errorBox}
        </div>
      )}
    </div>
  );
};

export default Users;
