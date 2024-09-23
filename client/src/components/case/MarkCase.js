import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import caseService from '../../services/caseService';

const MarkCase = () => {
  const [file, setFile] = useState(null);
  const [sendState, setSendState] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      alert('Please select a valid CSV file.');
      event.target.value = null; // Reset file input
    }
  };

  // Handle data send
  const handleDataSend = () => {
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }

    setSendState('sending');

    caseService
      .markCase(file)
      .then((response) => {
        console.log('Response:', response);
        setSendState('success');
        setStatusMessage(`${response.data.message}`);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSendState('error');
        alert('An error occurred while sending the data. Please try again.');
        setStatusMessage(`${error.message}`);
      });
  };

  const getStatusMessage = () => {
    switch (sendState) {
      case 'idle':
        return '';
      case 'sending':
        return '資料寫入中...';
      case 'success':
        return '資料寫入成功！';
      case 'error':
        return '發生錯誤，請重試。';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Row className="mt-3">
        <h2 className="text-center">標記案件</h2>
      </Row>
      {/* File Upload Component */}
      <Row className="justify-content-md-center mt-5">
        <Col xs lg="2" className="align-self-center"></Col>
        <Col xs lg="2">
          <div>
            <input
              className="form-control"
              type="file"
              id="formFile"
              accept=".csv"
              onChange={handleFileSelect}
            />
          </div>
        </Col>
        <Col xs lg="2" className="align-self-center">
          {sendState === 'idle' && (
            <button className="btn btn-primary" onClick={handleDataSend}>
              寫入資料庫
            </button>
          )}
        </Col>
      </Row>
      {/* Upload Status */}
      <Row className="mt-5">
        <Col></Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <p className="text-center">狀態： {getStatusMessage()}</p>
              <p className="text-center">{statusMessage}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default MarkCase;
