import React, { useState, useEffect } from 'react';
import { Card, Table } from 'react-bootstrap';

const ClaimAmount = ({ content }) => {
  const [claimAmount, setClaimAmount] = useState('');

  // Find the last match of a number in a string
  const findLastMatch = (s) => {
    // Remove "," from the string
    s = s.replace(/,/g, '');

    // Use regex to find all numbers or "萬" in the string
    // Ex: 被告應給付原告110萬元 => ["110萬"]
    const matches = [...s.matchAll(/\d+萬|\d+/g)];

    // Return the last match
    if (matches.length > 0) {
      // Get the last match
      const lastMatch = matches[matches.length - 1][0];

      // Add "," to the number
      // Ex: 110萬 => 110萬
      // Ex: 1110萬 => 1,110萬
      // Ex: 1110 => 1,110
      const formattedNumber = lastMatch
        .replace(/萬$/, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // If the original match ended with "萬", add it back
      const result = lastMatch.endsWith('萬')
        ? formattedNumber + '萬'
        : formattedNumber;

      // Return the formatted last match
      return result;
    } else {
      return '';
    }
  };

  // Extract the claim amount from the content
  const extractClaimAmount = (content) => {
    // Find the location of "聲明"
    const loc1 = content.indexOf('聲明');
    if (loc1 === -1) {
      // Handle the case where "聲明" is not found
      return '';
    }

    // Find the location of "元" after "聲明"
    const loc2 = content.indexOf('元', loc1);
    if (loc2 === -1) {
      // Handle the case where "元" is not found
      return '';
    }

    // Extract the amount from the sentence by regex
    const requestSentence = content.slice(loc1, loc2 + 1);

    // Find the last match of a number in the sentence
    const amount = findLastMatch(requestSentence);
    return amount;
  };

  // Get the extracted content with loading page
  const getExtractedContent = (content) => {
    const amount = extractClaimAmount(content);
    setClaimAmount(amount);
  };
  useEffect(() => {
    getExtractedContent(content);
  }, [content]);

  return (
    <div>
      <Table striped="columns">
        <tbody>
          <tr>
            <th>慰撫金</th>
            <td>x</td>
          </tr>
          <tr>
            <th>原告請求</th>
            <td>{claimAmount ? `${claimAmount}` : 'No found'}</td>
          </tr>
          <tr>
            <th>傷害</th>
            <td>x</td>
          </tr>
          <tr>
            <th>勞動力減損</th>
            <td>x</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ClaimAmount;
