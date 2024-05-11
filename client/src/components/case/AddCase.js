import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import caseService from "../../services/caseService";
import authService from "../../services/authService";

const AddCase = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  // const [progress, setProgress] = useState(false);
  const [browserUserId, setBrowserUserId] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);

  // Get user ID when component mounts
  useEffect(() => {
    const userId = authService.getUserId();
    setBrowserUserId(userId);
  }, []);

  // Handles file selection and initializes progress for each file
  const handleFileSelect = (selectedFiles) => {
    // Convert FileList to Array and set state
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);

    // Set total files count
    setTotalFiles(fileArray.length);

    // Initialize progress for each file
    const initialProgress = {};

    // Set initial progress to 0 for each file
    fileArray.forEach((file) => {
      initialProgress[file.name] = 0;
    });

    // // Set initial progress state
    setProgress(initialProgress);

    // Upload files sequentially
    uploadFilesSequentially(fileArray);
  };

  // Handles sequential file upload
  const uploadFilesSequentially = (fileArray) => {
    fileArray.reduce((promise, file) => {
      // Upload file to the server with api
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
          // Show success icon
          updateProgress(file.name, 100);

          // Show success icon
          // setProgress(true);

          // Increment current file count
          setCurrentFile((prevCurrentFile) => prevCurrentFile + 1);
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
    <Container>
      <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h2 className="text-center">新增案件</h2>
      </Row>
      {/* File Upload Component */}
      <Row
        className="justify-content-md-center"
        style={{ marginBottom: "20px" }}
      >
        <Col xs lg="5">
          <div className="mb-3">
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
      {/* Total progress Display */}
      <Row style={{ marginBottom: "20px" }}>
        <Card style={{ padding: "20px" }}>
          <Card.Text>
            <p className="text-center">
              {currentFile}/{totalFiles}
            </p>
            <div class="progress">
              <div
                class="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${(currentFile / totalFiles) * 100}%` }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </Card.Text>
        </Card>
      </Row>
      {/* Case by Case Progress Display */}
      <Row style={{ marginTop: "40px" }} className="justify-content-md-center">
        <Col
          xl="6"
          style={{
            // padding: "10px",
            // border: "1px solid #dee2e6",
            maxHeight: "600px",
            overflowY: "scroll",
            // whiteSpace: "pre-wrap",
          }}
        >
          <div>
            <p>Case list:</p>

            {files.map((file) => (
              <div key={file.name} className="d-flex align-items-center mb-2">
                <div className="me-2">
                  <FaFileAlt />
                </div>
                <div className="flex-grow-1 me-2">{file.name}</div>
                {/* <div className="flex-grow-1" style={{ marginLeft: "auto" }}>
                  <div className="progress" style={{ width: "100%" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progress[file.name]}%` }}
                      aria-valuenow={progress[file.name]}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div> */}
                <div className="flex-grow-1">
                  {progress[file.name] === 100 && (
                    <GiConfirmed style={{ color: "green" }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCase;
