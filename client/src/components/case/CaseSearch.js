import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CaseSearch = ({ caseKeyword }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // When loading the page, set value of Form.Control to the caseKeyword
  useEffect(() => {
    if (caseKeyword === "undefined") {
      setSearchKeyword("");
    } else {
      setSearchKeyword(caseKeyword);
    }
  }, [caseKeyword]);

  // Handle search button
  const handleSearch = () => {
    // e.preventDefault(); // Prevent the default form submission behavior
    console.log("Search keyword:", searchKeyword);

    // Redirect to the search result page
    navigate(`/cases/list/100/1/${searchKeyword}`);
  };

  return (
    <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="inlineFormInput" visuallyHidden>
            Name
          </Form.Label>
          <Form.Control
            className="mb-2"
            id="inlineFormInput"
            placeholder="輸入關鍵字..."
            value={searchKeyword}
            style={{ width: "300px" }}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
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
