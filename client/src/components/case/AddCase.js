import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import caseService from "../../services/caseService";
import authService from "../../services/authService";

const AddCase = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [browserUserId, setBrowserUserId] = useState("");

  // Get user ID when component mounts
  useEffect(() => {
    const userId = authService.getUserId();
    setBrowserUserId(userId);
  }, []);

  // Handles file selection and initializes progress for each file
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    const initialProgress = {};
    fileArray.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setProgress(initialProgress);
    uploadFilesSequentially(fileArray);
  };

  // Handles sequential file upload
  const uploadFilesSequentially = (fileArray) => {
    fileArray.reduce((promise, file) => {
      return promise.then(() => uploadFile(file));
    }, Promise.resolve());
  };

  // Uploads a single file to the API endpoint
  const uploadFile = (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        console.log("jsonData", jsonData);
        const caseData = {
          jid: jsonData.JID,
          jyear: jsonData.JYEAR,
          jcase: jsonData.JCASE,
          jno: jsonData.JNO,
          jdate: jsonData.JDATE,
          jtitle: jsonData.JTITLE,
          jfull: jsonData.JFULL,
          userId: browserUserId,
        };

        const response = await caseService.createCase(caseData);
        if (response.status === 201) {
          updateProgress(file.name, 100);
        } else {
          throw new Error("API response not OK");
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        updateProgress(file.name, 0);
      }
    };

    reader.onerror = (error) => {
      console.error(`Error reading ${file.name}:`, error);
      updateProgress(file.name, 0);
    };

    reader.readAsText(file); // Changed from readAsDataURL to readAsText
  };

  const updateProgress = (fileName, value) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [fileName]: value,
    }));
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Row className="justify-content-md-center">
        <Col xs lg="5">
          {/* File Upload Component */}
          <div className="mb-3">
            <label htmlFor="formFileMultiple" className="form-label">
              Multiple files input example
            </label>
            <input
              className="form-control"
              type="file"
              id="formFileMultiple"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }} className="justify-content-md-center">
        <Col xs lg="5">
          {/* Progress Display */}
          {files.map((file) => (
            <div key={file.name} className="d-flex align-items-center mb-2">
              <div className="me-2">
                <FaFileAlt />
              </div>
              <div className="flex-grow-1 me-2">{file.name}</div>
              <div className="flex-grow-1" style={{ marginLeft: "auto" }}>
                <div className="progress" style={{ width: "150%" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress[file.name]}%` }}
                    aria-valuenow={progress[file.name]}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default AddCase;
