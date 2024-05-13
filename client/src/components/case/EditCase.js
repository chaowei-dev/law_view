import React, { useEffect, useState } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import caseService from "../../services/caseService";

const EditCase = ({ onHide, show, lawCase, onSave }) => {
  const [formCase, setFormCase] = useState({
    ID: "",
    JID: "",
    JYEAR: "",
    JCASE: "",
    JNO: "",
    JDATE: "",
    JTITLE: "",
    REMARKS: "",
  });
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    if (lawCase) {
      // Log
      console.log("lawCase:", lawCase);

      // Set the created at date
      setFormCase({
        ID: lawCase.id,
        JID: lawCase.jid,
        JYEAR: lawCase.jyear,
        JCASE: lawCase.jcase,
        JNO: lawCase.jno,
        JDATE: lawCase.jdate,
        JTITLE: lawCase.jtitle,
        REMARKS: lawCase.remarks,
      });

      // Format the date and time to Taiwan time
      setCreatedAt(formatTime(lawCase.createdAt));
      setUpdatedAt(formatTime(lawCase.updatedAt));
    }
  }, [lawCase]);

  const formatTime = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}/${month}/${day} (${hours}:${minutes})`;
  };

  const handleSubmit = () => {
    // Pass the formCase to the service
    caseService
      .updateCase(lawCase.id, formCase)
      .then(() => {
        onHide(); // Close the modal
        onSave(); // Call onSave to refresh the cases list in parent component
      })
      .catch((error) => {
        console.error("Error updating case:", error);
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
          {lawCase ? "Edit Case" : "Add New Case"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-sm">JID:</InputGroup.Text>
          <Form.Control
            aria-label="JID"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JID}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JID: e.target.value }))
            }
            placeholder="Enter JID"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-sm">Year:</InputGroup.Text>
          <Form.Control
            aria-label="Year"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JYEAR}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JYEAR: e.target.value }))
            }
            placeholder="Enter Year"
          />
          <InputGroup.Text id="inputGroup-sizing-sm">Case:</InputGroup.Text>
          <Form.Control
            aria-label="Case"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JCASE}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JCASE: e.target.value }))
            }
            placeholder="Enter Case"
          />

          <InputGroup.Text id="inputGroup-sizing-sm">No:</InputGroup.Text>
          <Form.Control
            aria-label="No"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JNO}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JNO: e.target.value }))
            }
            placeholder="Enter No"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-sm">Date:</InputGroup.Text>
          <Form.Control
            aria-label="Date"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JDATE}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JDATE: e.target.value }))
            }
            placeholder="Enter Date"
          />
          <InputGroup.Text id="inputGroup-sizing-sm">Title:</InputGroup.Text>
          <Form.Control
            aria-label="Title"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={formCase.JTITLE}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, JTITLE: e.target.value }))
            }
            placeholder="Enter Title"
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Remarks:</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={formCase.REMARKS}
            onChange={(e) =>
              setFormCase((prev) => ({ ...prev, REMARKS: e.target.value }))
            }
            placeholder="Enter Remarks"
          />
        </Form.Group>
        <Form.Label>
          建立日期: {createdAt}, 更新日期: {updatedAt}
        </Form.Label>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCase;
