import React, { useState, useEffect, useCallback } from 'react';
import { Button, Col, Form, Table } from 'react-bootstrap';
import { formatDateTime } from '../../utils/timeUtils';
import { formatTWD } from '../../utils/format2TWD';

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
  const [dataExtractionDict, setDataExtractionDict] = useState({});

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
      // step 1: Process data extraction
      const dataExtraction = currentCase.dataExtraction;

      /* 
      dataExtraction example:
      {
        "compensation_amount": {
          "end_with": "元",
          "start_with": "、30000元、",
          "value": "10000"
        },
        "injured_part": {
            "end_with": "胸壁挫傷等",
            "start_with": "下背挫傷，",
            "value": "下背挫傷，原告甲○○受有背挫傷，原告林○○受有胸壁挫傷等"
        },
        "labor_ability_reduction": {
            "end_with": "",
            "start_with": "",
            "value": "0"
        },
        "medical_expense": {
            "end_with": "元",
            "start_with": "，分別支出醫療費",
            "value": "1650"
        },
        "request_amount": {
            "end_with": "元",
            "start_with": "付新臺幣（下同）",
            "value": "599150"
      }
      */

      if (dataExtraction) {
        setDataExtractionDict(dataExtraction);
      }
      // End of processing data extraction

      // Step 2: Process highlighted content
      let mainRegexPattern;
      let secondRegexPattern;

      // Main keyword
      // If main keyword is '原文', show full content and hide trim button
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

      // Second keyword
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

      // Use main and second keyword to highlight content
      highlightContent(mainRegexPattern, secondRegexPattern);
      // End of processing highlighted content
    }
  }, [
    currentCase,
    mainKeywordText,
    secondKeywordText,
    keywordList,
    highlightContent,
  ]);

  return (
    <>
      {/* Extraction Table */}
      <Col sm={4}>
        <div>
          {Object.keys(dataExtractionDict).length > 0 && (
            <Table striped="columns">
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>慰撫金</th>
                  <td style={{ width: '70%' }}>
                    {formatTWD(dataExtractionDict.compensation_amount.value)}
                  </td>
                  <td style={{ width: '30%' }}>
                    <Form.Check type="switch" id="custom-switch" label="" />
                  </td>
                </tr>
                <tr>
                  <th>原告請求</th>
                  {/* <td>{dataExtractionDict.request_amount}</td> */}
                  <td>{formatTWD(dataExtractionDict.request_amount.value)}</td>
                  <td>
                    <Form.Check type="switch" id="custom-switch" label="" />
                  </td>
                </tr>
                <tr>
                  <th>傷害</th>
                  <td>{dataExtractionDict.injured_part.value}</td>
                  <td>
                    <Form.Check type="switch" id="custom-switch" label="" />
                  </td>
                </tr>
                <tr>
                  <th>勞動力減損</th>
                  <td>
                    {dataExtractionDict.labor_ability_reduction.value === '1'
                      ? '有'
                      : dataExtractionDict.labor_ability_reduction.value === '0'
                      ? '無'
                      : '未知'}
                  </td>
                  <td>
                    <Form.Check type="switch" id="custom-switch" label="" />
                  </td>
                </tr>
                <tr>
                  <th>醫療費</th>
                  <td>{formatTWD(dataExtractionDict.medical_expense.value)}</td>
                  <td>
                    <Form.Check type="switch" id="custom-switch" label="" />
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </div>
        {/* Mark timestamp */}
        {currentCase.isHideUpdateAt && (
          <>
            標記日期: {formatDateTime(currentCase.isHideUpdateAt.updatedAt)}
            <br />
          </>
        )}
        {/* Update timestamp */}
        更新日期: {formatDateTime(currentCase.updatedAt)}
      </Col>
      {/* Case content */}
      <Col sm={8}>
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
      </Col>
    </>
  );
};

export default CaseView;
