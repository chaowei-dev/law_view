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

  // Download all remarks from database
  const handleDownloadAllRemarks = async () => {
    try {
      // Fetch JSON data from the backend
      const response = await caseService.downloadAllRemarks();
      const caseIds = response.data;

      if (!caseIds || caseIds.length === 0) {
        alert('No data available for download.');
        return;
      }

      // Convert JSON to CSV
      const headers = ['id', 'jid', 'remarks'];
      const csvRows = [
        headers.join(','), // Add headers
        ...caseIds.map((row) =>
          headers.map((header) => `"${row[header] || ''}"`).join(',')
        ), // Map each object to a CSV row
      ];

      const csvContent = csvRows.join('\n');

      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'case_ids_remarks.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Download complete.');
    } catch (error) {
      console.error('Error downloading remarks:', error);
      alert('An error occurred while downloading the remarks.');
    }
  };

  const handleDownloadAllJidExtraction = async () => {
    try {
      // Fetch JSON data from the backend
      const response = await caseService.downloadAllJidExtraction();
      const caseIds = response.data;

      if (!caseIds || caseIds.length === 0) {
        alert('No data available for download.');
        return;
      }

      // Convert JSON to CSV
      const headers = ['jid', 'compensation_amount', 'injured_part', "labor_ability_reduction", "medical_expense", "request_amount"];
      const csvRows = [
        headers.join(','), // Add headers
        ...caseIds.map((row) =>
          headers.map((header) => `"${row[header] || ''}"`).join(',')
        ), // Map each object to a CSV row
      ];

      const csvContent = csvRows.join('\n');

      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'case_ids_jid_extraction.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Download complete.');
    } catch (error) {
      console.error('Error downloading remarks:', error);
      alert('An error occurred while downloading the remarks.');
    }
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
      {/* Download button */}
      <Row className="mt-2 justify-content-center">
        <Col xl="auto">
          <Button variant="secondary" onClick={handleDownloadAllRemarks}>
            下載所有標記過的案件
          </Button>
        </Col>
        <Col xl="auto">
          <Button variant="secondary" onClick={handleDownloadAllJidExtraction}>
            下載包含Labels案件
          </Button>
        </Col>
      </Row>
      <hr />
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
      <Row className="mt-5 mb-5">
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
      <hr />
      <Row className="mt-5 align-items-center">
        <Col className="text-center">
          <div className="d-flex flex-column align-items-center">
            <p>初始化所有案件，意思為清楚所有案件的標記為「無Labels」。</p>
            <p>檔案來源: /res/caselist.csv</p>
          </div>
        </Col>
      </Row>
      {/* Hide all cases to true */}
      <Row className="align-items-center">
        {sendState === 'idle' && (
          <Row className="mt-2 justify-content-center">
            <Col xl="auto">
              <Button variant="danger" onClick={handleAllCaseToHide}>
                初始所有案件
              </Button>
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
};

export default MarkCase;
