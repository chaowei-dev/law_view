import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CaseSearch = ({ caseKeyword }) => {
  const [jidKeyword, setJidKeyword] = useState("");
  const [remarksKeyword, setRemarksKeyword] = useState("");
  const [jfullKeyword, setJfullKeyword] = useState("");
  const navigate = useNavigate();

  // When loading the page, set value of Form.Control to the caseKeyword
  useEffect(() => {
    if (caseKeyword === "undefined") {
      setJidKeyword("");
      setRemarksKeyword("");
      setJfullKeyword("");
    } else {
      // Split the caseKeyword, then set the value
      const [jid, remarks, jfull] = caseKeyword
        .split("&")
        .map((kw) => kw.split("=")[1]);
      setJidKeyword(jid || "");
      setRemarksKeyword(remarks || "");
      setJfullKeyword(jfull || "");
    }
  }, [caseKeyword]);

  // Handle search button
  const handleSearch = () => {    
    const searchKeyword = `jid=${jidKeyword}&remarks=${remarksKeyword}&jfull=${jfullKeyword}`;

    console.log("Search: ", searchKeyword);
    
    navigate(`/cases/list/100/1/${searchKeyword}`);
  };

  return (
    <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              案件
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="jidKeywordInput"
                value={jidKeyword}
                style={{ width: "300px" }}
                onChange={(e) => setJidKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              備註
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="remarksKeywordInput"
                value={remarksKeyword}
                style={{ width: "300px" }}
                onChange={(e) => setRemarksKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              全文
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="jfullKeywordInput"
                value={jfullKeyword}
                style={{ width: "300px" }}
                onChange={(e) => setJfullKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2" onClick={handleSearch}>
            搜尋
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CaseSearch;
