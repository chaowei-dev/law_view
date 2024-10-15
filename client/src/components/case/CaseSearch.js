import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CaseSearch = ({ caseKeyword }) => {
  const [jidKeyword, setJidKeyword] = useState('');
  const [remarksKeyword, setRemarksKeyword] = useState('');
  const [jfullKeyword, setJfullKeyword] = useState('');
  const [isHide, setIsHide] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();

  // When loading the page, set value of Form.Control to the caseKeyword
  useEffect(() => {
    if (caseKeyword === 'undefined') {
      setJidKeyword('');
      setRemarksKeyword('');
      setJfullKeyword('');
      setIsHide('');
      setDesc('');
    } else {
      // Split the caseKeyword, then set the value
      const [jid, remarks, jfull, isHide, desc] = caseKeyword
        .split('&')
        .map((kw) => kw.split('=')[1]);
      setJidKeyword(jid || '');
      setRemarksKeyword(remarks || '');
      setJfullKeyword(jfull || '');
      setIsHide(isHide || '');
      setDesc(desc || '');
    }
  }, [caseKeyword]);

  // Handle search button
  const handleSearch = () => {
    const searchKeyword = `jid=${jidKeyword}&remarks=${remarksKeyword}&jfull=${jfullKeyword}&isHide=${isHide}&desc=${desc}`;

    console.log('Search: ', searchKeyword);

    navigate(`/cases/list/100/1/${searchKeyword}`);
  };

  return (
    <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              案件:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="jidKeywordInput"
                value={jidKeyword}
                style={{ width: '300px' }}
                onChange={(e) => setJidKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              備註:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="remarksKeywordInput"
                value={remarksKeyword}
                placeholder="search non-empty remarks: !null"
                style={{ width: '300px' }}
                onChange={(e) => setRemarksKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              全文:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                id="jfullKeywordInput"
                value={jfullKeyword}
                style={{ width: '300px' }}
                onChange={(e) => setJfullKeyword(e.target.value)}
              />
            </Col>
          </Form.Group>
          {/* isHide */}
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              標記:
            </Form.Label>
            <Col sm="10">
              <Form.Select
                className="mb-2"
                id="isHideSelect"
                value={isHide}
                style={{ width: '300px' }}
                onChange={(e) => setIsHide(e.target.value)}
              >
                <option value="">全部</option>
                <option value="false">有</option>
                <option value="true">無</option>
              </Form.Select>
            </Col>
          </Form.Group>
          {/* DESC */}
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              排序:
            </Form.Label>
            <Col sm="10">
              <Form.Select
                className="mb-2"
                id="descSelect"
                value={desc}
                style={{ width: '300px' }}
                onChange={(e) => setDesc(e.target.value)}
              >
                <option value="">預設(照標號)</option>
                <option value="true">由新到舊</option>
                <option value="false">由舊到新</option>
              </Form.Select>
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
