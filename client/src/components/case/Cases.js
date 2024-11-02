import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import caseService from '../../services/caseService';
import keywordService from '../../services/keywordService';
import EditCase from './EditCase';
import CaseNav from './CaseNav';
import CaseView from './CaseView';
import { copyWithFeedback } from '../../utils/copyUtils';

const Cases = ({ isLabel }) => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseIDs, setCaseIDs] = useState([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainKeywordText, setMainKeywordText] = useState('原文');
  const [secondKeywordText, setSecondKeywordText] = useState('無');
  const [keywordList, setKeywordList] = useState([]);
  const [oriHighlightContent, setOriHighlightContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [dataExtraction, setDataExtraction] = useState({});
  const [editingWindowShow, setEditingWindowShow] = useState(false);

  // Step 1: Fetch all keywords
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await keywordService.getKeywords();
        setKeywordList(response.data);
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    };
    fetchKeywords();
  }, []);

  // Step 2: Fetch all case IDs
  useEffect(() => {
    const fetchCaseIDs = async () => {
      try {
        const response = await caseService.getAllCaseIDs(isLabel);
        setCaseIDs(response.data);
        const index = response.data.findIndex(
          (caseItem) => caseItem.id.toString() === caseId
        );
        if (index !== -1) setCurrentIndex(index);
      } catch (error) {
        console.error('Error fetching case IDs:', error);
      }
    };
    fetchCaseIDs();
  }, [caseId, isLabel]);

  // Step 3: Fetch case content by index
  const fetchContent = useCallback(async () => {
    const isLabelText = isLabel ? 'true' : 'false';

    if (caseIDs.length > 0 && caseIDs[currentIndex]) {
      try {
        const response = await caseService.getCaseById(
          caseIDs[currentIndex].id,
          isLabelText
        );
        setCurrentCase(response.data);
        // setDataExtraction(response.data.dataExtraction);
        setOriHighlightContent(response.data.jfull);
      } catch (error) {
        console.error('Error fetching case:', error);
      }
    }
  }, [currentIndex, caseIDs]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]); // eslint-disable-next-line

  // Handler for keyword selection change
  const handleMainKeywordChange = (e) => {
    setMainKeywordText(e.target.value);
  };
  const handleSecondKeywordChange = (e) => {
    setSecondKeywordText(e.target.value);
  };

  // EDITING
  const handleEditClick = (c) => {
    setCurrentCase(c);
    setEditingWindowShow(true);
  };

  // update remark of the case to "正確"
  const handleCorrectButtonClick = () => {
    caseService
      .updateCase(currentCase.id, { REMARKS: '正確' })
      .then(() => {
        fetchContent();
      })
      .catch((error) => {
        console.error('Error updating case:', error);
      });
  };

  // Handle copy button
  const handleCopyContent = () => {
    copyWithFeedback(oriHighlightContent, setCopySuccess);
  };

  // Render loading state or case content
  if (!currentCase.jid || caseIDs.length === 0) {
    return (
      <Container>
        <Row>
          <Col xl="auto">
            <h1>無任何案件...</h1>
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
              <Card.Text style={{ fontSize: '60%' }}>
                {currentCase.jyear}年度{currentCase.jcase}字第{currentCase.jno}
                號 ({currentCase.jdate}), {currentCase.jtitle}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* Remarks card */}
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>備註:</Card.Title>
              <Card.Text>{currentCase.remarks}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* EDIT button */}
        <Col>
          <div className="d-flex justify-content-end mt-1">
            <Button
              variant="outline-success"
              onClick={() => handleCorrectButtonClick()}
            >
              正確
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => handleEditClick(currentCase)}
            >
              Edit
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        {/* Keyword selection */}
        <Col className="mb-3">
          <div className="d-flex align-items-center">
            <p className="mb-0 me-2">主要關鍵字:</p>
            <select
              style={{ maxWidth: '300px' }}
              className="form-select"
              aria-label="Default select example"
              value={mainKeywordText}
              onChange={handleMainKeywordChange}
            >
              <option value="原文">原文</option>
              {keywordList.map((k) => (
                <option key={k.id} value={k.keyword}>
                  {k.keyword} {k.pattern && ` - (${k.pattern})`}
                </option>
              ))}
            </select>
          </div>
          {/* Second keyword selection */}
          <div className="d-flex align-items-center mt-2">
            <p className="mb-0 me-2">次要關鍵字:</p>
            <select
              style={{ maxWidth: '300px' }}
              className="form-select"
              aria-label="Default select example"
              value={secondKeywordText}
              onChange={handleSecondKeywordChange}
              disabled={mainKeywordText === '原文'}
            >
              <option>無</option>
              {keywordList.map(
                (k) =>
                  k.keyword !== mainKeywordText && (
                    <option key={k.id} value={k.keyword}>
                      {k.keyword} {k.pattern && ` - (${k.pattern})`}
                    </option>
                  )
              )}
            </select>
          </div>
        </Col>
        {/* Nav case */}
        <Col
          xs={8}
          sm={4}
          className="d-flex align-items-center justify-content-center"
        >
          <CaseNav
            currentIndex={currentIndex}
            caseIDs={caseIDs}
            navigate={navigate}
            isLabel={isLabel}
          />
        </Col>
        <Col xs={4} sm={2}>
          <div className="d-flex justify-content-end mt-4">
            {/* Copy button */}
            <Button variant="outline-primary" onClick={handleCopyContent}>
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        {/* <Col sm={4}> */}
        {/* Extraction */}
        {/* <DataExtract dataExtraction={dataExtraction} isLabel={isLabel} /> */}

        {/* </Col> */}
        {/* Content */}
        {/* If "currentCase", "mainKeywordText", "secondKeywordText", "keywordList" */}
        {/* are updated then rerender the CaseView */}
        {/* <Col sm={8}> */}
        <CaseView
          currentCase={currentCase}
          mainKeywordText={mainKeywordText}
          secondKeywordText={secondKeywordText}
          keywordList={keywordList}
        />
        {/* </Col> */}
      </Row>
      {/* Editing modal */}
      {editingWindowShow && (
        <EditCase
          show={editingWindowShow}
          onHide={() => setEditingWindowShow(false)}
          lawCase={currentCase}
          onSave={fetchContent} // Passing fetchCaseList as onSave to refresh the list
        />
      )}
    </Container>
  );
};

export default Cases;
