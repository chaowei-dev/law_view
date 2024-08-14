import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

const ClaimAmount = ({ content }) => {
  const [extractedContent, setExtractedContent] = useState('');

  // Find the last match of a number in a string
  const findLastMatch = (s) => {
    // Remove "," from the string
    s = s.replace(/,/g, '');

    // Use regex to find all numbers in the string
    const matches = [...s.matchAll(/\d+/g)];

    // Return the last match
    if (matches.length > 0) {
      // Get the last match
      const lastMatch = matches[matches.length - 1];

      // add "," to the number
      const number = lastMatch[0];
      const numberLength = number.length;
      const numberParts = [];
      for (let i = 0; i < numberLength; i += 3) {
        numberParts.push(number.slice(i, i + 3));
      }
      lastMatch[0] = numberParts.join(',');

      // Return the last match
      return lastMatch[0];
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

  useEffect(() => {
    const amount = extractClaimAmount(content);
    setExtractedContent(amount);
  }, [content]);

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Text>
            {extractedContent ? `原告請求: ${extractedContent}元` : 'No found'}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClaimAmount;
