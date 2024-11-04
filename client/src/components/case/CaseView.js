import React, { useState, useEffect, useCallback } from 'react';
import { Button, Col, Form, Table } from 'react-bootstrap';
import { formatDateTime } from '../../utils/timeUtils';
import { formatTWD } from '../../utils/format2TWD';
import DOMPurify from 'dompurify';

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
  const [highlightSwitches, setHighlightSwitches] = useState({});
  const [switchDisabled, setSwitchDisabled] = useState(true);

  // Utility function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Handle switch toggle
  const handleSwitchToggle = (key) => {
    setHighlightSwitches((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Highlighting function
  const highlightContent = useCallback(
    (mainRegexPattern, secondRegexPattern) => {
      let content = currentCase.jfull;

      if (mainRegexPattern && !mainRegexPattern.test(content)) {
        setKeywordContent(`${mainKeywordText} NOT FOUND!`);
        setOriHighlightContent('');
        return;
      }

      // Reset content to original before applying highlights
      content = currentCase.jfull;

      // Apply main keyword highlighting
      if (mainRegexPattern) {
        content = content.replace(
          mainRegexPattern,
          (match) => `<mark><b>${match}</b></mark>`
        );
      }

      // Apply second keyword highlighting
      if (secondRegexPattern) {
        content = content.replace(
          secondRegexPattern,
          (match) =>
            `<mark style="background-color: orange;"><b>${match}</b></mark>`
        );
      }

      // Apply additional highlights based on switches
      Object.keys(highlightSwitches).forEach((key) => {
        if (highlightSwitches[key]) {
          const extraction = dataExtractionDict[key];
          if (extraction && extraction.start_with && extraction.end_with) {
            const { start_with, end_with } = extraction;

            // Construct regex to include start_with and end_with
            // [\s\S]*? matches any character (including newlines) non-greedily
            const regex = new RegExp(
              `(${escapeRegExp(start_with)}[\\s\\S]*?${escapeRegExp(
                end_with
              )})`,
              'gi'
            );

            // Replace matched content with highlighted version
            content = content.replace(
              regex,
              (match) =>
                `<mark style="background-color: yellow;"><b>${match}</b></mark>`
            );
          }
        }
      });

      setOriHighlightContent(content.trim());

      // For keywordContent (trimmed view)
      let keywordContentStr = content; // Use already highlighted content
      if (showTrimmedContent) {
        // If trimming is enabled, keep the full highlighted content
        setKeywordContent(content.trim());
      } else {
        // If not trimming, show only the portion from the main keyword onwards
        const mainMatch = mainRegexPattern
          ? currentCase.jfull.match(mainRegexPattern)
          : null;
        const startIndex = mainMatch
          ? currentCase.jfull.indexOf(mainMatch[0])
          : 0;

        keywordContentStr = currentCase.jfull.substring(startIndex);

        if (mainRegexPattern) {
          keywordContentStr = keywordContentStr.replace(
            mainRegexPattern,
            (match) => `<mark><b>${match}</b></mark>`
          );
        }
        if (secondRegexPattern) {
          keywordContentStr = keywordContentStr.replace(
            secondRegexPattern,
            (match) =>
              `<mark style="background-color: orange;"><b>${match}</b></mark>`
          );
        }

        // Apply additional highlights to keywordContentStr
        Object.keys(highlightSwitches).forEach((key) => {
          if (highlightSwitches[key]) {
            const extraction = dataExtractionDict[key];
            if (extraction && extraction.start_with && extraction.end_with) {
              const { start_with, end_with } = extraction;
              const regex = new RegExp(
                `(${escapeRegExp(start_with)}[\\s\\S]*?${escapeRegExp(
                  end_with
                )})`,
                'gi'
              );
              keywordContentStr = keywordContentStr.replace(
                regex,
                (match) =>
                  `<mark style="background-color: yellow;"><b>${match}</b></mark>`
              );
            }
          }
        });

        setKeywordContent(keywordContentStr.trim());
      }
    },
    [
      currentCase.jfull,
      mainKeywordText,
      dataExtractionDict,
      highlightSwitches,
      showTrimmedContent,
    ]
  );

  // Initialize highlight switches when dataExtractionDict changes
  useEffect(() => {
    if (dataExtractionDict) {
      const initialSwitches = {};
      Object.keys(dataExtractionDict).forEach((key) => {
        initialSwitches[key] = false;
      });
      setHighlightSwitches(initialSwitches);
    }
  }, [dataExtractionDict]);

  // Main useEffect to process data extraction and highlight content
  useEffect(() => {
    if (currentCase && currentCase.jfull) {
      // Step 1: Process data extraction
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
        setKeywordContent(currentCase.jfull); // Show full content
        setOriHighlightContent(currentCase.jfull); // Show full content
        setShowTrimmedContent(false); // Disable trimming
        setShowTrimButton(false); // Hide trim button
        setSwitchDisabled(true); // Disable switches
        setHighlightSwitches({}); // Reset switches
        return;
      } else {
        setShowTrimButton(true); // Show trim button
        setSwitchDisabled(false); // Enable switches
      }

      const mainKeywordObj = keywordList.find(
        (k) => k.keyword === mainKeywordText
      );

      mainRegexPattern = mainKeywordObj?.pattern
        ? new RegExp(mainKeywordObj.pattern, 'gi')
        : new RegExp(escapeRegExp(mainKeywordText), 'gi');

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
        : new RegExp(escapeRegExp(secondKeywordText), 'gi');

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
                {/* Compensation Amount */}
                <tr>
                  <th style={{ width: '30%' }}>慰撫金</th>
                  <td style={{ width: '70%' }}>
                    {formatTWD(dataExtractionDict.compensation_amount.value)}
                  </td>
                  <td style={{ width: '30%' }}>
                    <Form.Check
                      type="switch"
                      id="switch-compensation_amount"
                      label=""
                      disabled={switchDisabled}
                      checked={highlightSwitches.compensation_amount || false}
                      onChange={() => handleSwitchToggle('compensation_amount')}
                    />
                  </td>
                </tr>
                {/* Request Amount */}
                <tr>
                  <th>原告請求</th>
                  <td>{formatTWD(dataExtractionDict.request_amount.value)}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="switch-request_amount"
                      label=""
                      disabled={switchDisabled}
                      checked={highlightSwitches.request_amount || false}
                      onChange={() => handleSwitchToggle('request_amount')}
                    />
                  </td>
                </tr>
                {/* Injured Part */}
                <tr>
                  <th>傷害</th>
                  <td>{dataExtractionDict.injured_part.value}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="switch-injured_part"
                      label=""
                      disabled={switchDisabled}
                      checked={highlightSwitches.injured_part || false}
                      onChange={() => handleSwitchToggle('injured_part')}
                    />
                  </td>
                </tr>
                {/* Labor Ability Reduction */}
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
                    <Form.Check
                      type="switch"
                      id="switch-labor_ability_reduction"
                      label=""
                      disabled={switchDisabled}
                      checked={
                        highlightSwitches.labor_ability_reduction || false
                      }
                      onChange={() =>
                        handleSwitchToggle('labor_ability_reduction')
                      }
                    />
                  </td>
                </tr>
                {/* Medical Expense */}
                <tr>
                  <th>醫療費</th>
                  <td>{formatTWD(dataExtractionDict.medical_expense.value)}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id="switch-medical_expense"
                      label=""
                      disabled={switchDisabled}
                      checked={highlightSwitches.medical_expense || false}
                      onChange={() => handleSwitchToggle('medical_expense')}
                    />
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
              __html: DOMPurify.sanitize(
                showTrimmedContent
                  ? oriHighlightContent
                  : keywordContent || 'No Content Available'
              ),
            }}
          ></div>
        </div>
      </Col>
    </>
  );
};

export default CaseView;
