import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import caseService from "../../services/caseService";
import keywordService from "../../services/keywordService";
import EditCase from "./EditCase";

const Cases = () => {
  // const basicKeywordList = ["事實及理由, 事實, 理由", "得心證", "慰撫金"];

  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseIDs, setCaseIDs] = useState([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keywordContent, setKeywordContent] = useState("");
  const [keywordText, setKeywordText] = useState("");
  const [keywordList, setKeywordList] = useState([]);
  const [originalContent, setOriginalContent] = useState("");
  const [editingWindowShow, setEditingWindowShow] = useState(false);

  // Get all keywords
  useEffect(() => {
    keywordService
      .getKeywords()
      .then((response) => {
        setKeywordList(response.data);
        setKeywordText(response.data[0].keyword);
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });
  }, []);

  // Fetch all case IDs
  useEffect(() => {
    caseService
      .getAllCaseIDs()
      .then((response) => {
        // Store case IDs and set current index
        setCaseIDs(response.data);

        // Find index of current case ID
        const index = response.data.findIndex(
          (caseItem) => caseItem.id.toString() === caseId
        );

        // Set current index if found
        if (index !== -1) setCurrentIndex(index);
      })
      .catch((error) => {
        console.error("Error fetching case IDs:", error);
      });
  }, [caseId]);

  // Fetch content for the current case by index
  const fetchContent = () => {
    if (caseIDs.length > 0 && caseIDs[currentIndex]) {
      caseService
        .getCaseById(caseIDs[currentIndex].id)
        .then((response) => {
          setCurrentCase(response.data);
          setOriginalContent(response.data.jfull);
        })
        .catch((error) => {
          console.error("Error fetching case:", error);
        });
    }
  };
  useEffect(() => {
    fetchContent();
  }, [currentIndex, caseIDs]);

  // Set keyword jfull content
  useEffect(() => {
    if (currentCase && currentCase.jfull) {
      let regexPattern;

      // Determine the regex pattern based on the selected keyword
      // if (keywordText === "事實及理由, 事實, 理由") {
      //   regexPattern = /事\s*實|理\s*由/gi; // Regex pattern to find "事實及理由"
      // } else {
      //   regexPattern = new RegExp(keywordText, "gi"); // Regex pattern for a specific keyword
      // }

      // Find the keyword in the content and get the text after it
      // if pattern.value of keywordText is existed, then use pattern value
      // else create a new RegExp
      const keywordObj = keywordList.find((k) => k.keyword === keywordText);

      if (keywordObj && keywordObj.pattern) {
        regexPattern = new RegExp(keywordObj.pattern, "gi");
      } else {
        regexPattern = new RegExp(keywordText, "gi");
      }

      console.log("regexPattern:", regexPattern);

      // Find the keyword in the content and get the text after it
      const match = regexPattern.exec(currentCase.jfull);

      if (match) {
        // Get the text after the keyword
        const startIndex = match.index;
        const textAfterKeyword = currentCase.jfull.substring(startIndex);

        // Highlight the keyword in the original text
        const highlightedOriginalContent = currentCase.jfull.replace(
          regexPattern,
          (match) => `<mark><b>${match}</b></mark>`
        );
        setOriginalContent(highlightedOriginalContent.trim());

        // Highlight the keyword in the after text
        const highlightedKeywordContent = textAfterKeyword.replace(
          regexPattern,
          (match) => `<mark><b>${match}</b></mark>`
        );
        setKeywordContent(highlightedKeywordContent.trim());
      } else {
        // Provide a message if the section is not found
        setKeywordContent(
          `Section '${keywordText}' not found in the provided text.`
        );
      }
    }
  }, [currentCase, keywordText]);

  // Handle keyword selection change
  const handleKeywordChange = (e) => {
    // Get selected values
    const options = e.target.options;

    // Get selected values
    const selectedValues = [];

    // Loop through the options and get the selected values
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }

    // Set the keyword state
    setKeywordText(selectedValues[0]); // Assuming single selection for now
  };

  // EDITING
  const handleEditClick = (c) => {
    setCurrentCase(c);
    setEditingWindowShow(true);
  };

  // Navigation handlers
  const handlePrevCase = () => {
    if (currentIndex > 0) {
      navigate(`/cases/view/${caseIDs[currentIndex - 1].id}`);
    }
  };
  const handleNextCase = () => {
    if (currentIndex < caseIDs.length - 1) {
      navigate(`/cases/view/${caseIDs[currentIndex + 1].id}`);
    }
  };
  const handleInput = (e) => {
    const newIndex = parseInt(e.target.value, 10) - 1; // Convert to zero-based index
    if (!isNaN(newIndex) && newIndex >= 0 && newIndex < caseIDs.length) {
      navigate(`/cases/view/${caseIDs[newIndex].id}`);
    }
  };

  // Loading state
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
        {/* Basic information */}
        <Col className="align-items-center">
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
        {/* Edit Button */}
        <Col className="d-flex justify-content-center align-items-center">
          <Button
            variant="secondary"
            onClick={() => handleEditClick(currentCase)}
          >
            編輯
          </Button>{" "}
        </Col>
        {/* Navigation */}
        <Col className="d-flex justify-content-center align-items-center">
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
            style={{ width: "100px" }}
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
      </Row>
      <Row className="mb-2">
        <Col>
          <h4>原文:</h4>
        </Col>
        <Col>
          <h4>關鍵字:</h4>
        </Col>
      </Row>
      {/* Content */}
      <Row>
        <Col>
          <div
            style={{
              padding: "10px",
              border: "1px solid #dee2e6",
              maxHeight: "815px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{
              __html: originalContent || "No Content Available",
            }}
          ></div>
        </Col>
        <Col>
          {/* Select keyword */}
          <select
            style={{ height: "100px" }}
            className="form-select mb-3"
            aria-label="Select a section"
            value={keywordText} // This controls which option is selected
            onChange={handleKeywordChange} // This updates the state on change
            multiple
          >
            {/* {basicKeywordList.map((k, index) => (
              <option key={index} value={k} selected={k === keyword}>
                {k}
              </option>
            ))} */}
            {keywordList.map((k) => (
              <option
                key={k.id}
                value={k.keyword}
                selected={k.keyword === keywordText}
              >
                {k.keyword} {k.pattern && ` - (${k.pattern})`}
              </option>
            ))}
          </select>

          {/* Keyword Content */}
          <div>
            <div
              style={{
                padding: "10px",
                border: "1px solid #dee2e6",
                maxHeight: "700px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{
                __html: keywordContent || "No Content Available",
              }}
            ></div>
          </div>
        </Col>
      </Row>
      {/* Editing modal */}
      {editingWindowShow && currentCase && (
        <EditCase
          show={editingWindowShow}
          onHide={() => setEditingWindowShow(false)}
          lawCase={currentCase}
          onSave={fetchContent}
        />
      )}
    </Container>
  );
};

export default Cases;
