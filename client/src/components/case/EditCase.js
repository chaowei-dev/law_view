import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import caseService from '../../services/caseService';

const EditCase = ({ onHide, show, lawCase, onSave }) => {
  const [formCase, setFormCase] = useState({
    JTITLE: '',
    REMARKS: '',
  });
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [markedAt, setMarkedAt] = useState('');

  const remarksRef = useRef(null); // Create a ref for the Remarks input

  useEffect(() => {
    if (lawCase) {
      setFormCase({
        JTITLE: lawCase.jtitle,
        REMARKS: lawCase.remarks,
      });

      setCreatedAt(formatTime(lawCase.createdAt));
      setUpdatedAt(formatTime(lawCase.updatedAt));
      if (lawCase.is_hide === false)
        setMarkedAt(formatTime(lawCase.isHideUpdateAt.updatedAt));
    }
  }, [lawCase]);

  useEffect(() => {
    if (show && remarksRef.current) {
      remarksRef.current.focus(); // Focus on the Remarks textarea when the modal opens
    }
  }, [show]);

  const formatTime = (date) => {
    const newDate = new Date(date).toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const newTime = new Date(date).toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      hour12: false,
      minute: '2-digit',
      hour: '2-digit',
    });

    return `${newDate} (${newTime})`;
  };

  const handleSubmit = () => {
    caseService
      .updateCase(lawCase.id, formCase)
      .then(() => {
        onHide();
        onSave();
      })
      .catch((error) => {
        console.error('Error updating case:', error);
      });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {lawCase ? 'Edit Case' : 'Add New Case'}
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
            disabled
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
            ref={remarksRef} // Attach the ref to the Remarks input
          />
        </Form.Group>
        <Form.Label>
          建立日期: {createdAt}, 更新日期: {updatedAt}, 標記日期: {markedAt}
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
