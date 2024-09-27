import React, { useState, useEffect } from 'react';
import {  Table } from 'react-bootstrap';

const DataExtract = ({ dataExtraction, isLabel }) => {
  const [dataExtractionDict, setDataExtractionDict] = useState({
    compensation_amount: '',
    request_amount: '',
    injured_part: '',
    labor_ability_reduction: '',
    medical_expense: '',
  });

  // Format to TWD
  const formatTWD = (value) => {
    if (!value) return '';

    // Return formatted TWD
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle labor_ability_reduction
  const handleLaborAbilityReduction = (value) => {
    const laborAbilityMap = {
      0: '無',
      1: '有',
    };

    return laborAbilityMap[value] || '';
  };

  // Load dataExtraction
  useEffect(() => {
    if (dataExtraction) {
      setDataExtractionDict({
        compensation_amount: formatTWD(dataExtraction.compensation_amount),
        request_amount: formatTWD(dataExtraction.request_amount),
        injured_part: dataExtraction.injured_part,
        labor_ability_reduction: handleLaborAbilityReduction(
          dataExtraction.labor_ability_reduction
        ),
        medical_expense: formatTWD(dataExtraction.medical_expense),
      });
    }
  }, [dataExtraction]);

  return (
    <div>
      <Table striped="columns">
        <tbody>
          <tr>
            <th>慰撫金</th>
            <td>{dataExtractionDict.compensation_amount}</td>
          </tr>
          <tr>
            <th>原告請求</th>
            <td>{dataExtractionDict.request_amount}</td>
          </tr>
          <tr>
            <th>傷害</th>
            <td>{dataExtractionDict.injured_part}</td>
          </tr>
          <tr>
            <th>勞動力減損</th>
            <td>
              {/* {(dataExtraction.labor_ability_reduction = '1' ? '有' : '無')} */}
              {dataExtractionDict.labor_ability_reduction}
            </td>
          </tr>
          <tr>
            <th>醫療費</th>
            <td>{dataExtractionDict.medical_expense}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DataExtract;
