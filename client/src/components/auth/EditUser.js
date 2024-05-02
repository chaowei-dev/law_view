import React, { useEffect, useState } from "react";
import authService from "../../services/authService";
import { Button, Modal, Form } from "react-bootstrap";

const EditUser = ({
  onHide,
  show,
  user,
  onSave,
  setMessageBox,
  setErrorBox,
}) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = () => {
    authService
      .updateUser(user.id, { username, role })
      .then(() => {
        onHide();
        onSave();
        setMessageBox("User updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setErrorBox("Failed to update user.");
      });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {user ? "Edit User" : "Add New User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="normal-user">Normal User</option>
              <option value="super-user">Super User</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
