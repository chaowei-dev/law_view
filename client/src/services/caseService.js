// services/caseService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/cases/";

// http://localhost:3001/api/cases/{limit}/{page}
const getAllCases = (limit, page) => {
  return axios.get(API_URL + limit + "/" + page, {
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

const getCaseById = (id) => {
  return axios.get(API_URL + id, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
}

export default { getAllCases, getNumberOfCases, getCaseById };
