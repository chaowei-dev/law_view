import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';
import caseService from '../../services/caseService';
import keywordService from '../../services/keywordService';
import DataExtract from './DataExtract';

const Cases = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [caseIDs, setCaseIDs] = useState([]);
  const [currentCase, setCurrentCase] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keywordContent, setKeywordContent] = useState('');
  const [mainKeywordText, setMainKeywordText] = useState('原文');
  const [secondKeywordText, setSecondKeywordText] = useState('無');
  const [keywordList, setKeywordList] = useState([]);
  const [oriHighlightContent, setOriHighlightContent] = useState('');
  const [showTrimmedContent, setShowTrimmedContent] = useState(false);
  const [showTrimButton, setShowTrimButton] = useState(true);
  const [currentCaseRemarks, setCurrentCaseRemarks] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [dataExtraction, setDataExtraction] = useState({});

  // Fetch all keywords
  useEffect(() => {
    keywordService
      .getKeywords()
      .then((response) => {
        setKeywordList(response.data);
        // setMainKeywordText(response.data[0]?.keyword || "");
      })
      .catch((error) => {
        console.error('Error fetching keywords:', error);
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
        console.error('Error fetching case IDs:', error);
      });
  }, [caseId]);

  // Fetch case content by index
  const fetchContent = () => {
    if (caseIDs.length > 0 && caseIDs[currentIndex]) {
      caseService
        .getCaseById(caseIDs[currentIndex].id)
        .then((response) => {
          // Get case
          setCurrentCase(response.data);
          console.log('Current case:', response.data);

          // Set data extraction
          setDataExtraction(response.data.dataExtraction);
          console.log('Data extraction:', response.data.dataExtraction);

          // Set original content
          setOriHighlightContent(response.data.jfull);

          // Get/Set remarks
          setCurrentCaseRemarks(response.data.remarks);
          console.log('Current remarks:', response.data.remarks);
        })
        .catch((error) => {
          console.error('Error fetching case:', error);
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
      let mainRegexPattern;
      let secondRegexPattern;

      // If the keyword is "原文", display the full content
      if (mainKeywordText === '原文') {
        setKeywordContent(currentCase.jfull);
        setShowTrimmedContent(false);
        setShowTrimButton(false);
        return;
      } else {
        setShowTrimButton(true);
      }

      // Main keyword regex pattern
      const mainKeywordObj = keywordList.find(
        (k) => k.keyword === mainKeywordText
      );

      mainRegexPattern =
        mainKeywordObj && mainKeywordObj.pattern
          ? new RegExp(mainKeywordObj.pattern, 'gi')
          : new RegExp(mainKeywordText, 'gi');

      // If second keyword is "無"
      // Highlight the main keyword only
      if (secondKeywordText === '無') {
        highlightContent(mainRegexPattern, null);
        return;
      }

      // Second keyword regex pattern
      const secondKeywordObj = keywordList.find(
        (k) => k.keyword === secondKeywordText
      );

      secondRegexPattern =
        secondKeywordObj && secondKeywordObj.pattern
          ? new RegExp(secondKeywordObj.pattern, 'gi')
          : new RegExp(secondKeywordText, 'gi');

      // Highlight the keywords
      highlightContent(mainRegexPattern, secondRegexPattern);
    }
  }, [currentCase, mainKeywordText, secondKeywordText, keywordList]);

  // Highlight the keywords in the original content
  const highlightContent = (mainRegexPattern, secondRegexPattern) => {
    // 1. Check main keyword is found in the content
    if (mainRegexPattern && !mainRegexPattern.test(currentCase.jfull)) {
      setKeywordContent(`${mainKeywordText} NOT FOUND!`);
      return;
    }

    // 2. Original content highlighting
    let highlightedOriginalContent = currentCase.jfull;

    // 2-1. Highlight the main keyword
    if (mainRegexPattern) {
      highlightedOriginalContent = highlightedOriginalContent.replace(
        mainRegexPattern,
        (match) => `<mark><b>${match}</b></mark>`
      );
    }

    // 2-2. Highlight the second keyword
    if (secondRegexPattern) {
      highlightedOriginalContent = highlightedOriginalContent.replace(
        secondRegexPattern,
        (match) => `<mark><b>${match}</b></mark>`
      );
    }

    setOriHighlightContent(highlightedOriginalContent.trim());

    // 3-1. Trimmed content with main keyword
    const startIndex = mainRegexPattern
      ? mainRegexPattern.exec(currentCase.jfull)?.index || 0
      : 0;

    const textAfterKeyword = currentCase.jfull.substring(startIndex);
    let highlightedKeywordContent = textAfterKeyword;

    // 3-2. Highlight the main keyword
    if (mainRegexPattern) {
      highlightedKeywordContent = highlightedKeywordContent.replace(
        mainRegexPattern,
        (match) => `<mark><b>${match}</b></mark>`
      );
    }

    // 3-3. Highlight the second keyword
    if (secondRegexPattern) {
      highlightedKeywordContent = highlightedKeywordContent.replace(
        secondRegexPattern,
        (match) =>
          `<mark style="background-color: orange;"><b>${match}</b></mark>`
      );
    }

    setKeywordContent(highlightedKeywordContent.trim());
  };

  // Handler for keyword selection change
  const handleMainKeywordChange = (e) => {
    setMainKeywordText(e.target.value);
  };
  const handleSecondKeywordChange = (e) => {
    setSecondKeywordText(e.target.value);
  };

  // Handler for saving remarks
  const handleRemarksSave = async () => {
    const updatedCase = {
      ...currentCase,
      REMARKS: currentCaseRemarks,
    };

    console.log('Updated case:', updatedCase);

    try {
      // Update the remarks in the database
      const response = await caseService.updateCase(
        currentCase.id,
        updatedCase
      );
      console.log('Remarks updated:', response.data);

      // Update the local state to reflect the new remarks
      setCurrentCase((prevState) => ({
        ...prevState,
        remarks: currentCaseRemarks,
      }));
    } catch (error) {
      console.error('Error updating remarks:', error);
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

  // Handle copy button
  const copyToClipboard = (text) => {
    // Clipboard API is not supported, use fallback method
    let textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyContent = () => {
    // use non-https clipboard API
    copyToClipboard(oriHighlightContent);

    // Show success message for 2 seconds
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
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
            style={{ width: '80px' }}
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
        {/* Copy button */}
        <Col
          xs={4}
          sm={2}
          className="d-flex flex-column justify-content-center"
        >
          <Button
            variant="outline-secondary"
            onClick={handleCopyContent}
            style={{ position: 'absolute', right: '20px' }}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        </Col>
      </Row>
      <Row>
        {/* Extraction */}
        <Col sm={4}>
          <DataExtract dataExtraction={dataExtraction} />
        </Col>
        {/* Content */}
        <Col sm={8}>
          <div style={{ position: 'relative' }}>
            {/* Trim button */}
            {showTrimButton && (
              <Button
                type="button"
                variant={
                  showTrimmedContent ? 'primary ms-auto' : 'secondary ms-auto'
                }
                style={{ position: 'absolute', top: '10px', right: '20px' }}
                onClick={() => setShowTrimmedContent(!showTrimmedContent)}
              >
                {showTrimmedContent ? '裁切' : '全文'}
              </Button>
            )}
            <div
              style={{
                padding: '10px',
                border: '1px solid #dee2e6',
                maxHeight: '700px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{
                __html: showTrimmedContent
                  ? oriHighlightContent
                  : keywordContent || 'No Content Available',
              }}
            ></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Cases;
