import React, { useState, useEffect } from "react";
import caseService from "../../services/caseService";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";

const Cases = () => {
  const [caseList, setCaseList] = useState([]);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    fetchCaseList();
  }, []);

  useEffect(() => {
    fetchNumberOfPages();
  }, [caseList]);

  const fetchCaseList = () => {
    caseService
      .getAllCases()
      .then((response) => {
        setCaseList(response.data);
        setCurrentCaseIndex(0);
        console.log("Fetched cases:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching cases:", error);
      });
  };

  const fetchNumberOfPages = () => {
    caseService
      .getNumberOfCases()
      .then((response) => {
        setTotalCases(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching number of cases:", error);
      });
  };

  const handlePrevCase = () => {
    const newIndex = currentCaseIndex - 1;
    if (newIndex >= 0) {
      setCurrentCaseIndex(newIndex);
    }
  };

  const handleNextCase = () => {
    const newIndex = currentCaseIndex + 1;
    if (newIndex < caseList.length) {
      setCurrentCaseIndex(newIndex);
    }
  };

  const handleInput = (e) => {
    const index = parseInt(e.target.value, 10) - 1; // Convert input to zero-based index
    if (index >= 0 && index < caseList.length) {
      setCurrentCaseIndex(index);
    }
  };

  if (caseList.length === 0) {
    return <div>Loading...</div>;
  }

  const currentCase = caseList[currentCaseIndex];

  return (
    <Container>
      {/* Title */}
      <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <b>{currentCase.jid}</b>
              </Card.Title>
              <Card.Text>
                {currentCase.jyear}年度{currentCase.jcase}字第{currentCase.jno}
                號 ({currentCase.jdate})， {currentCase.jtitle}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Pagination */}
      <Row>
        <Col className="d-flex align-items-center">
          <Button
            variant="link"
            onClick={handlePrevCase}
            disabled={currentCaseIndex === 0}
            className="me-2"
          >
            <ArrowLeftCircle size={24} />
          </Button>
          <Form.Control
            type="number"
            value={currentCaseIndex + 1}
            onChange={handleInput}
            style={{ width: "50px" }}
            className=" me-2"
            min="1"
            max={caseList.length}
          />
          <span>/ {totalCases}</span>
          <Button
            variant="link"
            onClick={handleNextCase}
            disabled={currentCaseIndex === caseList.length - 1}
            className="ms-2"
          >
            <ArrowRightCircle size={24} />
          </Button>
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
              whiteSpace: "pre-wrap", // Preserves whitespace
            }}
            dangerouslySetInnerHTML={{
              __html: currentCase.jfull || "No Content Available", // Allows HTML content to be rendered (<br>)
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Cases;
