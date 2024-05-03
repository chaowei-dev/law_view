// services/caseService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/cases/";

// http://localhost:3001/api/cases/page/{limit}/{page}
const getAllCases = (limit, page) => {
  return axios.get(API_URL + "page/" + limit + "/" + page, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

// http://localhost:3001/api/cases/count
const getNumberOfCases = () => {
  return axios.get(API_URL + "count", {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

// http://localhost:3001/api/cases/case/{id}
const getCaseById = (id) => {
  return axios.get(API_URL + "case/" + id, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
}

// http://localhost:3001/api/cases/all-id
const getAllCaseIDs = () => {
  return axios.get(API_URL + "all-id", {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

export default { getAllCases, getNumberOfCases, getCaseById, getAllCaseIDs };
