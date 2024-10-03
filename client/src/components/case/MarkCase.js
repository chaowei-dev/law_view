import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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
      setSendState('sendable');
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

  const handleAllCaseToHide = () => {
    // show check dialog
    if (!window.confirm('確定要「初始化」所有案件嗎？')) {
      return;
    }

    // send api to backend
    caseService
      .markCaseToHide()
      .then((response) => {
        console.log('Response:', response);
        alert('All cases have been marked as hidden.');
        setSendState('all-hidden');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while marking all cases as hidden.');
      });
  };

  const getStatusMessage = () => {
    switch (sendState) {
      case 'idle':
        return '';
      case 'sendable':
        return '資料準備中...';
      case 'sending':
        return '資料寫入中...';
      case 'success':
        return '資料寫入成功！';
      case 'all-hidden':
        return '所有案件已隱藏。';
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
      {/* Hide all cases to true */}
      {sendState === 'idle' && (
        <Row className="mt-5 justify-content-center">
          <Col xl="auto">
            <Button variant="danger" onClick={handleAllCaseToHide}>
              初始所有案件
            </Button>
          </Col>
        </Row>
      )}
      {/* File Upload Component */}
      <Row className="justify-content-md-center mt-5">
        {(sendState === 'idle' || sendState === 'sendable') && (
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
        )}
        <Col xs lg="2" className="align-self-center">
          {sendState === 'sendable' && (
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
      <Row className="mt-5 align-items-center">
        <Col className="text-center">
          <div className="d-flex flex-column align-items-center">
            <p>請標記案件前，初始化所有案件。</p>
            <p>檔案來源: /res/caselist.csv</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MarkCase;
