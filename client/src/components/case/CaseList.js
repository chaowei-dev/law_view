import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import caseService from "../../services/caseService";
import CasePagination from "./CasePagination";

const CaseList = () => {
  const [caseList, setCaseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(2); // Assuming this is fixed for now
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCaseList = async () => {
      try {
        const response = await caseService.getAllCases(pageLimit, currentPage);
        setCaseList(response.data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchCaseList();
  }, [currentPage, pageLimit]); // Depend on currentPage

  useEffect(() => {
    const fetchNumberOfPages = async () => {
      try {
        const response = await caseService.getNumberOfCases();
        setTotalPages(Math.ceil(response.data.count / pageLimit)); // Correct calculation for totalPages
      } catch (error) {
        console.error("Error fetching number of cases:", error);
      }
    };

    fetchNumberOfPages();
  }, [pageLimit]);

  const paginationHtml = (
    <CasePagination
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );

  // Loading state
  if (caseList.length === 0) {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Case List</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Loading cases...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row style={{ marginTop: "20px" }}>
        <Col>
          <h1>Case List</h1>
        </Col>
        <Col className="d-flex justify-content-end">{paginationHtml}</Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">編號</th>
                <th className="text-center">案件</th>
                <th className="text-center">字號</th>
                <th className="text-center">日期</th>
                <th className="text-center">案由</th>
              </tr>
            </thead>
            <tbody>
              {caseList.map((c) => (
                <tr key={c.id}>
                  <th className="text-center">{c.id}</th>
                  <th>
                    <a href={`/cases/view/${c.id}`}>{c.jid}</a>
                  </th>
                  <th>
                    {c.jyear}年度{c.jcase}字第{c.jno}號
                  </th>
                  <th>{c.jdate}</th>
                  <th>{c.jtitle}</th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col className="d-flex justify-content-center">{paginationHtml}</Col>
        <Col className="d-flex justify-content-end">
          {/* Dropdown for page limit */}
          <Form.Control
            as="select"
            value={pageLimit}
            onChange={(e) => setPageLimit(e.target.value)}
            style={{ width: "100px" }}
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Control>
        </Col>
      </Row>
    </Container>
  );
};

export default CaseList;
