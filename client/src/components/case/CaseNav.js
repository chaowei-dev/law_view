// CaseNav.js
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-bootstrap-icons';

const CaseNav = ({ currentIndex, caseIDs, navigate, isLabel }) => {
  const isLabelPage = isLabel ? '/cases' : '/cases-non-label';

  const handlePrevCase = () => {
    if (currentIndex > 0)
      navigate(`${isLabelPage}/view/${caseIDs[currentIndex - 1].id}`);
  };

  const handleNextCase = () => {
    if (currentIndex < caseIDs.length - 1)
      navigate(`${isLabelPage}/view/${caseIDs[currentIndex + 1].id}`);
  };

  const handleInput = (e) => {
    const newIndex = parseInt(e.target.value, 10) - 1; // Convert to zero-based index
    if (!isNaN(newIndex) && newIndex >= 0 && newIndex < caseIDs.length) {
      navigate(`${isLabelPage}/view/${caseIDs[newIndex].id}`);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Button variant="link" onClick={handlePrevCase} disabled={currentIndex === 0}>
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
    </div>
  );
};

export default CaseNav;
