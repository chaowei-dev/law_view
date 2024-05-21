import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import caseService from "../../services/caseService";
import keywordService from "../../services/keywordService";
import EditCase from "./EditCase";

const Cases = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseIDs, setCaseIDs] = useState([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keywordContent, setKeywordContent] = useState("");
  const [keywordText, setKeywordText] = useState("");
  const [keywordList, setKeywordList] = useState([]);
  const [oriHighlightContent, setOriHighlightContent] = useState("");
  const [editingWindowShow, setEditingWindowShow] = useState(false);
  const [showTrimmedContent, setShowTrimmedContent] = useState(false);
  const [showTrimButton, setShowTrimButton] = useState(true);
  const [currentCaseRemarks, setCurrentCaseRemarks] = useState("");

  // Fetch all keywords
  useEffect(() => {
    keywordService
      .getKeywords()
      .then((response) => {
        setKeywordList(response.data);
        setKeywordText(response.data[0]?.keyword || "");
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });
  }, []);

  // Fetch all case IDs and determine the current index
  useEffect(() => {
    caseService
      .getAllCaseIDs()
      .then((response) => {
        setCaseIDs(response.data);
        const index = response.data.findIndex(
          (caseItem) => caseItem.id.toString() === caseId
        );
        if (index !== -1) setCurrentIndex(index);
      })
      .catch((error) => {
        console.error("Error fetching case IDs:", error);
      });
  }, [caseId]);

  // Fetch case content by index
  const fetchContent = () => {
    if (caseIDs.length > 0 && caseIDs[currentIndex]) {
      caseService
        .getCaseById(caseIDs[currentIndex].id)
        .then((response) => {
          setCurrentCase(response.data);
          setOriHighlightContent(response.data.jfull);
          setCurrentCaseRemarks(response.data.remarks);
          console.log("Current case:", response.data);
          console.log("Current remarks:", response.data.remarks);
        })
        .catch((error) => {
          console.error("Error fetching case:", error);
        });
    }
  };

  useEffect(() => {
    fetchContent();
  }, [currentIndex, caseIDs]);

  // Reset currentCaseRemarks when the currentCase changes
  useEffect(() => {
    if (currentCase && currentCase.remarks !== undefined) {
      setCurrentCaseRemarks(currentCase.remarks);
    }
  }, [currentCase]);

  // Update keyword content when current case or keyword text changes
  useEffect(() => {
    if (currentCase && currentCase.jfull) {
      let regexPattern;

      // If the keyword is "原文", display the full content
      if (keywordText === "原文") {
        setKeywordContent(currentCase.jfull);
        setShowTrimmedContent(false);
        setShowTrimButton(false);
        return;
      } else{
        setShowTrimButton(true);
      }

      // Find the keyword object based on the keyword text
      const keywordObj = keywordList.find((k) => k.keyword === keywordText);

      // Create a regex pattern based on the keyword object or the keyword text
      regexPattern =
        keywordObj && keywordObj.pattern
          ? new RegExp(keywordObj.pattern, "gi")
          : new RegExp(keywordText, "gi");

      console.log("regexPattern:", regexPattern);

      // Find the keyword in the original content
      const match = regexPattern.exec(currentCase.jfull);

      // Highlight the keyword in the original content
      if (match) {
        // Get the text after the keyword
        const startIndex = match.index;
        const textAfterKeyword = currentCase.jfull.substring(startIndex);

        // Highlight the keyword in the original content
        const highlightedOriginalContent = currentCase.jfull.replace(
          regexPattern,
          (match) => `<mark><b>${match}</b></mark>`
        );        
        setOriHighlightContent(highlightedOriginalContent.trim());

        // Highlight the keyword in the text after the keyword
        const highlightedKeywordContent = textAfterKeyword.replace(
          regexPattern,
          (match) => `<mark><b>${match}</b></mark>`
        );
        setKeywordContent(highlightedKeywordContent.trim());
      } else {
        setKeywordContent(
          `Section '${keywordText}' not found in the provided text.`
        );
      }
    }
  }, [currentCase, keywordText, keywordList]);

  // Handler for keyword selection change
  const handleKeywordChange = (e) => {
    setKeywordText(e.target.value);
  };

  // Handler for saving remarks
  const handleRemarksSave = async () => {
    const updatedCase = {
      ID: currentCase.id,
      JID: currentCase.jid,
      JYEAR: currentCase.jyear,
      JCASE: currentCase.jcase,
      JNO: currentCase.jno,
      JDATE: currentCase.jdate,
      JTITLE: currentCase.jtitle,
      REMARKS: currentCaseRemarks,
    };

    console.log("Updated case:", updatedCase);

    try {
      // Update the remarks in the database
      const response = await caseService.updateCase(
        currentCase.id,
        updatedCase
      );
      console.log("Remarks updated:", response.data);

      // Update the local state to reflect the new remarks
      setCurrentCase((prevState) => ({
        ...prevState,
        remarks: currentCaseRemarks,
      }));
    } catch (error) {
      console.error("Error updating remarks:", error);
    }
  };

  // Navigation handlers
  const handlePrevCase = () => {
    if (currentIndex > 0)
      navigate(`/cases/view/${caseIDs[currentIndex - 1].id}`);
  };

  const handleNextCase = () => {
    if (currentIndex < caseIDs.length - 1)
      navigate(`/cases/view/${caseIDs[currentIndex + 1].id}`);
  };

  const handleInput = (e) => {
    const newIndex = parseInt(e.target.value, 10) - 1; // Convert to zero-based index
    if (!isNaN(newIndex) && newIndex >= 0 && newIndex < caseIDs.length) {
      navigate(`/cases/view/${caseIDs[newIndex].id}`);
    }
  };

  // Render loading state or case content
  if (!currentCase.jid) {
    return (
      <Container>
        <Row>
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4 mt-4">
        {/* Case Info */}
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <b>{currentCase.jid}</b>
              </Card.Title>
              <Card.Text>
                {currentCase.jyear}年度{currentCase.jcase}字第{currentCase.jno}
                號 ({currentCase.jdate}), {currentCase.jtitle}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Remarks input */}
        <Col>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              value={currentCaseRemarks}
              onChange={(e) => setCurrentCaseRemarks(e.target.value)}
              placeholder="Enter Remarks"
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-1">
            <Button variant="outline-dark" onClick={() => handleRemarksSave()}>
              Save Remarks
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>判決書內文:</h4>
        </Col>
      </Row>
      <Row className="mb-3">
        {/* Keyword selection */}
        <Col xs={12} sm={6} className="mb-3">
          <div className="d-flex align-items-center">
            <p className="mb-0 me-2">關鍵字:</p>
            <select
              style={{ maxWidth: "300px" }}
              className="form-select"
              aria-label="Default select example"
              value={keywordText}
              onChange={handleKeywordChange}
            >
              <option value="原文">原文</option>
              {keywordList.map((k) => (
                <option key={k.id} value={k.keyword}>
                  {k.keyword} {k.pattern && ` - (${k.pattern})`}
                </option>
              ))}
            </select>
          </div>
        </Col>
        {/* Nav case */}
        <Col
          xs={8}
          sm={4}
          className="d-flex align-items-center justify-content-center"
        >
          <Button
            variant="link"
            onClick={handlePrevCase}
            disabled={currentIndex === 0}
          >
            <ArrowLeftCircle size={24} />
          </Button>
          <Form.Control
            type="number"
            value={currentIndex + 1}
            onChange={handleInput}
            style={{ width: "80px" }}
            min="1"
            max={caseIDs.length}
            className="me-2 ms-2"
          />
          <span>/ {caseIDs.length}</span>
          <Button
            variant="link"
            onClick={handleNextCase}
            disabled={currentIndex === caseIDs.length - 1}
          >
            <ArrowRightCircle size={24} />
          </Button>
        </Col>
        {/* Trim button */}
        <Col xs={4} sm={2} className="d-flex justify-content-end">
          {showTrimButton && (
            <Button
              type="button"
              className={
                showTrimmedContent
                  ? "btn btn-primary ms-auto"
                  : "btn btn-secondary ms-auto"
              }
              onClick={() => setShowTrimmedContent(!showTrimmedContent)}
            >
              {showTrimmedContent ? "裁切" : "全文"}
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        {/* Content */}
        <Col>
          <div
            style={{
              padding: "10px",
              border: "1px solid #dee2e6",
              maxHeight: "700px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{
              __html: showTrimmedContent
                ? oriHighlightContent
                : keywordContent || "No Content Available",
            }}
          ></div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cases;
