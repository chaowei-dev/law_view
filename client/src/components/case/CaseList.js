import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Dropdown,
  Modal,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import caseService from "../../services/caseService";
import authService from "../../services/authService";

import EditCase from "./EditCase";
import CasePagination from "./CasePagination";
import CaseSearch from "./CaseSearch";

const CaseList = () => {
  // use params and navigate
  const { pageNum, pageSize, caseKeyword } = useParams();
  const navigate = useNavigate();

  // Use state
  const [caseList, setCaseList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [deletingConfirmShow, setDeletingConfirmShow] = useState(false);
  const [editingWindowShow, setEditingWindowShow] = useState(false);
  const [currentCase, setCurrentCase] = useState(""); // To track which case is being edited

  // Get user role
  const userRole = authService.getUserRole();

  // Fetch case list
  const fetchCaseList = async () => {
    try {
      const response = await caseService.getAllCases(
        pageSize,
        pageNum,
        caseKeyword
      );
      setCaseList(response.data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  // Fetch case list on initial load
  useEffect(() => {
    fetchCaseList();
  }, [pageNum, pageSize]); // Depend on currentPage and pageLimit

  // Fetch number of pages for pagination on initial load
  useEffect(() => {
    const fetchNumberOfPages = async () => {
      try {
        const response = await caseService.getNumberOfCasesByKeyword(
          caseKeyword
        );
        setTotalCases(response.data.count);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        console.error("Error fetching number of cases:", error);
      }
    };

    fetchNumberOfPages();
  }, [pageSize]);

  const paginationHtml = (
    <CasePagination
      totalCases={totalCases}
      totalPages={totalPages}
      navigate={navigate}
      pageNum={pageNum}
      pageSize={pageSize}
      caseKeyword={caseKeyword}
    />
  );

  // DELETION
  const handleDeleteClick = (c) => {
    setCurrentCase(c);
    setDeletingConfirmShow(true);
  };
  const handleCancelDelete = () => {
    setDeletingConfirmShow(false);
  };
  const handleConfirmDelete = async () => {
    caseService
      .deleteCase(currentCase.id)
      .then(() => {
        setDeletingConfirmShow(false);
        fetchCaseList();
      })
      .catch((error) => {
        console.error("Error deleting case:", error);
      });
  };

  // EDITING
  const handleEditClick = (c) => {
    setCurrentCase(c);
    setEditingWindowShow(true);
  };

  // CHANGE page limit
  const handlePageLimitChange = (e) => {
    navigate(`/cases/list/${e}/1/${caseKeyword}`);
  };

  // Loading state
  // if (caseList.length === 0) {
  //   return (
  //     <Container>
  //       <Row>
  //         <Col>
  //           <h1>Case List</h1>
  //         </Col>
  //       </Row>
  //       <Row>
  //         <Col>
  //           <p>Not case contain keyword: "<b>{caseKeyword}</b>"</p>
  //         </Col>
  //       </Row>
  //     </Container>
  //   );
  // }

  let serialNum = (pageNum - 1) * pageSize + 1;

  return (
    <Container>
      <Row style={{ marginTop: "20px" }}>
        <Col>
          <CaseSearch caseKeyword={caseKeyword} navigate={navigate} />
        </Col>
        <Col className="d-flex justify-content-end">
          {paginationHtml}
          <p className="ml-3 mt-2">{totalCases}筆</p>
        </Col>
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
                <th className="text-center">備註</th>
                <th className="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              {caseList.map((c) => (
                <>
                  <tr key={c.id}>
                    <th rowSpan="2" className="text-center align-middle">
                      {serialNum++}
                    </th>
                    <th>
                      <a href={`/cases/view/${c.id}`}>{c.jid}</a>
                    </th>
                    <th>
                      {c.jyear}年度{c.jcase}字第{c.jno}號
                    </th>
                    <th>{c.jdate}</th>
                    <th>{c.jtitle}</th>
                    <th rowSpan="2">{c.remarks}</th>
                    <th rowSpan="2" className="align-middle">
                      {userRole === "super-user" && (
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="secondary"
                            size="sm"
                            id="dropdown-basic"
                          >
                            Actions
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleEditClick(c)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteClick(c)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </th>
                  </tr>
                  <tr>
                    <td colSpan="4" className="text-left">
                      <div
                        dangerouslySetInnerHTML={{ __html: c.jfullSummary }}
                      />
                    </td>
                  </tr>
                </>
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
            value={pageSize}
            onChange={(e) => handlePageLimitChange(e.target.value)}
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
      {/* Editing modal */}
      {editingWindowShow && currentCase && (
        <EditCase
          show={editingWindowShow}
          onHide={() => setEditingWindowShow(false)}
          lawCase={currentCase}
          onSave={fetchCaseList} // Passing fetchCaseList as onSave to refresh the list
        />
      )}
      {/* Deleting confirmation modal */}
      {deletingConfirmShow && currentCase && (
        <Modal show={deletingConfirmShow} onHide={handleCancelDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Delete "${currentCase.jid}"?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default CaseList;
