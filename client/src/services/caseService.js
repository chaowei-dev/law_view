// services/caseService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/cases/";

const getAllCases = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const getNumberOfCases = () => {
  return axios.get(API_URL + "count", {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

export default { getAllCases, getNumberOfCases };
