import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import caseService from "../../services/caseService";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";

const Cases = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();

  const [caseIDs, setCaseIDs] = useState([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch all case IDs on component mount
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

  // Fetch individual CASE data when ID changes
  useEffect(() => {
    if (caseIDs.length > 0 && caseIDs[currentIndex]) {
      caseService
        .getCaseById(caseIDs[currentIndex].id)
        .then((response) => {
          setCurrentCase(response.data);
        })
        .catch((error) => {
          console.error("Error fetching case:", error);
        });
    }
  }, [currentIndex, caseIDs]);

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
      <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
        {/* Navigation */}
        <Col className="d-flex align-items-center">
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
            style={{ width: "50px" }}
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
        {/* Basic information */}
        <Col className="align-items-center">
          <Card>
            <Card.Body>
              <Card.Title>
                <b>{currentCase.jid}</b>
              </Card.Title>
              <Card.Text>
                {currentCase.jyear}年度{currentCase.jcase}字第{currentCase.jno}
                号 ({currentCase.jdate}), {currentCase.jtitle}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Content */}
      <Row style={{ marginTop: "20px" }}>
        <Col>
          <h4>內文:</h4>
        </Col>
      </Row>
      <Row style={{ maxHeight: "600px", overflowY: "auto" }}>
        <Col>
          <div
            style={{
              padding: "10px",
              border: "1px solid #dee2e6",
              maxHeight: "600px",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{
              __html: currentCase.jfull || "No Content Available",
            }}
          ></div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cases;
