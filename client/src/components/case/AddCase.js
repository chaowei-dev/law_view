import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { FaFileAlt } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import caseService from "../../services/caseService";
import authService from "../../services/authService";

const AddCase = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [browserUserId, setBrowserUserId] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [sendState, setSendState] = useState("idle"); // "idle," "preparing," "sending," or "success"

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
      // Ulpoad file to the API
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
      };

      // Send case data to the API
      const response = await caseService.createCase(caseData);

      // Check if response is OK
      if (response.status === 201) {
        // Show success icon
        updateProgress(file.name, 100);

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

  const updateProgress = (fileName, value) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [fileName]: value,
    }));
  };

  const getStatusMessage = () => {
    if (sendState === "preparing") return "檔案上傳成功，等待寫入資料庫！";
    if (sendState === "sending") return "資料寫入中...";
    if (sendState === "success") return "資料寫入成功！";
    return "";
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
      <Row style={{ marginBottom: "20px" }}>
        <Card style={{ padding: "20px" }}>
          <Card.Text>
            <p className="text-center">{getStatusMessage()}</p>
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
            <p className="font-weight-bold">Case list:</p>

            {files.map((file) => (
              <div key={file.name} className="d-flex align-items-center mb-2">
                <div className="me-2">
                  <FaFileAlt />
                </div>
                <div className="flex-grow-1 me-2">{file.name}</div>
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
