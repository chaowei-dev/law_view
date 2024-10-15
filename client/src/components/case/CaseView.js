import React, { useState, useEffect, useCallback } from 'react';
import {Button} from 'react-bootstrap';

const CaseView = ({
  currentCase,
  mainKeywordText,
  secondKeywordText,
  keywordList,
}) => {
  const [keywordContent, setKeywordContent] = useState('');
  const [oriHighlightContent, setOriHighlightContent] = useState('');
  const [showTrimmedContent, setShowTrimmedContent] = useState(false);
  const [showTrimButton, setShowTrimButton] = useState(true);

  const highlightContent = useCallback(
    (mainRegexPattern, secondRegexPattern) => {
      if (mainRegexPattern && !mainRegexPattern.test(currentCase.jfull)) {
        setKeywordContent(`${mainKeywordText} NOT FOUND!`);
        return;
      }

      let highlightedOriginalContent = currentCase.jfull.replace(
        mainRegexPattern,
        (match) => `<mark><b>${match}</b></mark>`
      );

      if (secondRegexPattern) {
        highlightedOriginalContent = highlightedOriginalContent.replace(
          secondRegexPattern,
          (match) =>
            `<mark style="background-color: orange;"><b>${match}</b></mark>`
        );
      }

      setOriHighlightContent(highlightedOriginalContent.trim());

      const startIndex = mainRegexPattern
        ? mainRegexPattern.exec(currentCase.jfull)?.index || 0
        : 0;

      let highlightedKeywordContent = currentCase.jfull
        .substring(startIndex)
        .replace(mainRegexPattern, (match) => `<mark><b>${match}</b></mark>`)
        .replace(
          secondRegexPattern,
          (match) =>
            `<mark style="background-color: orange;"><b>${match}</b></mark>`
        );

      setKeywordContent(highlightedKeywordContent.trim());
    },
    [currentCase.jfull, mainKeywordText]
  );

  useEffect(() => {
    if (currentCase && currentCase.jfull) {
      let mainRegexPattern;
      let secondRegexPattern;

      if (mainKeywordText === '原文') {
        setKeywordContent(currentCase.jfull);
        setShowTrimmedContent(false);
        setShowTrimButton(false);
        return;
      } else {
        setShowTrimButton(true);
      }

      const mainKeywordObj = keywordList.find(
        (k) => k.keyword === mainKeywordText
      );

      mainRegexPattern = mainKeywordObj?.pattern
        ? new RegExp(mainKeywordObj.pattern, 'gi')
        : new RegExp(mainKeywordText, 'gi');

      if (secondKeywordText === '無') {
        highlightContent(mainRegexPattern, null);
        return;
      }

      const secondKeywordObj = keywordList.find(
        (k) => k.keyword === secondKeywordText
      );

      secondRegexPattern = secondKeywordObj?.pattern
        ? new RegExp(secondKeywordObj.pattern, 'gi')
        : new RegExp(secondKeywordText, 'gi');

      highlightContent(mainRegexPattern, secondRegexPattern);
    }
  }, [
    currentCase,
    mainKeywordText,
    secondKeywordText,
    keywordList,
    highlightContent,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      {showTrimButton && (
        <Button
          variant={showTrimmedContent ? 'primary' : 'secondary'}
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
  );
};

export default CaseView;
