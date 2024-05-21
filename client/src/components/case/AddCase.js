import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { MdError } from "react-icons/md";
import caseService from "../../services/caseService";
import authService from "../../services/authService";

const AddCase = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [browserUserId, setBrowserUserId] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [sendState, setSendState] = useState("idle"); // "idle," "preparing," "sending," or "success"
  const [errorCaseList, setErrorCaseList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Track uploaded files and their statuses

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

    // Initialize progress for each file
    initializeProgress(fileArray);

    // Set send status to true
    setSendState("preparing");
  };

  // Initialize progress for each file
  const initializeProgress = (fileArray) => {
    // Clean up error case list
    setErrorCaseList([]);

    // Reset uploaded files
    setUploadedFiles([]);

    // Set total files count
    setTotalFiles(fileArray.length);

    const initialProgress = {};

    // Set initial progress to 0 for each file
    fileArray.forEach((file) => {
      initialProgress[file.name] = 0;
    });

    // Set initial progress state
    setProgress(initialProgress);

    // Set current file to 0
    setCurrentFile(0);
  };

  // Handles data sending to the server
  const handleDataSend = async () => {
    // Upload files sequentially
    uploadFilesSequentially(files);
  };

  // Handles sequential file upload
  const uploadFilesSequentially = async (fileArray) => {
    setSendState("sending");

    for (let file of fileArray) {
      // Upload file to the API
      await uploadFile(file);

      // delay 0.1s
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setSendState("success");
  };

  // Read file contents
  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Set up reader
      reader.onload = (event) => {
        resolve(event.target.result);
      };

      // Set up error handler
      reader.onerror = (error) => {
        reject(error);
      };

      // Read file as text
      reader.readAsText(file);
    });
  };

  // Uploads a single file to the API endpoint
  const uploadFile = async (file) => {
    try {
      // Get file data and Parse JSON
      const fileData = await readFileData(file);
      const jsonData = JSON.parse(fileData);

      // Create case data
      const caseData = {
        jid: jsonData.JID,
        jyear: jsonData.JYEAR,
        jcase: jsonData.JCASE,
        jno: jsonData.JNO,
        jdate: jsonData.JDATE,
        jtitle: jsonData.JTITLE,
        jfull: jsonData.JFULL,
        userId: browserUserId,
        remarks: ""
      };

      // Send case data to the API
      const response = await caseService.createCase(caseData);

      // Check if response is OK
      if (response.status === 201) {
        // Show success icon
        updateProgress(file.name, 100);

        // Increment current file count
        setCurrentFile((prevCurrentFile) => prevCurrentFile + 1);

        // Add to uploaded files
        setUploadedFiles((prevUploadedFiles) => [
          { name: file.name, status: "success" },
          ...prevUploadedFiles,
        ]);
      } else {
        throw new Error("API response not OK");
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      updateProgress(file.name, 0);
      setErrorCaseList((prevErrorCaseList) => [
        ...prevErrorCaseList,
        file.name,
      ]);

      // Add to uploaded files with error status
      setUploadedFiles((prevUploadedFiles) => [
        { name: file.name, status: "error" },
        ...prevUploadedFiles,
      ]);
    }
  };

  const updateProgress = (fileName, value) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [fileName]: value,
    }));
  };

  const getStatusMessage = () => {
    if (sendState === "preparing") return "檔案處理成功，等待寫入資料庫...";
    if (sendState === "sending") return "資料寫入中...";
    if (sendState === "success") return "資料寫入成功！";
    return "";
  };

  return (
    <Container>
      <Row className="mt-3">
        <h2 className="text-center">新增案件</h2>
      </Row>
      {/* File Upload Component */}
      <Row className="justify-content-md-center mt-5">
        <Col xs lg="2" className="align-self-center"></Col>
        <Col xs lg="2">
          <div>
            <input
              className="form-control"
              type="file"
              id="formFileMultiple"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>
        </Col>
        <Col xs lg="2" className="align-self-center">
          {sendState === "preparing" && (
            <button className="btn btn-primary" onClick={handleDataSend}>
              寫入資料庫
            </button>
          )}
        </Col>
      </Row>
      {/* Total progress Display */}
      <Row className="mt-5">
        <Card style={{ padding: "20px" }}>
          <Card.Text>
            <p className="text-center">{getStatusMessage()}</p>
            <p className="text-center">
              {currentFile}/{totalFiles}
            </p>
            <div className="progress">
              <div
                className="progress-bar bg-danger"
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
      <Row className="justify-content-md-center mt-5">
        <Col xl="4">
          <p className="font-weight-bold">Case list:</p>
          <div
            style={{
              maxHeight: "500px",
              overflowY: "scroll",
            }}
          >
            {uploadedFiles
              .filter((file) => file.status !== "error")
              .map((file, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div className="me-2">
                    <FaFileAlt />
                  </div>
                  <div className="flex-grow-1 me-2">{file.name}</div>
                  <div className="flex-grow-1">
                    {file.status === "success" && (
                      <GiConfirmed style={{ color: "green" }} />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Col>
        {/* Error List */}
        <Col xl="4">
          <p className="font-weight-bold">Error Cases:</p>
          <div
            style={{
              maxHeight: "500px",
              overflowY: "scroll",
            }}
          >
            {errorCaseList.map((fileName, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <div className="flex-grow-1 me-2">{fileName}</div>
                <div className="me-2">
                  <MdError style={{ color: "red" }} />
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
