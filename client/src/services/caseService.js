// services/caseService.js
import axios from "axios";

// const API_URL = "http://localhost:3001/api/cases/";
const API_URL = process.env.REACT_APP_API_URL + "/cases/";

const caseService = {
  // /api/cases/page/{limit}/{page}
  getAllCases: (size, page) => {
    return axios.get(API_URL + "list/" + size + "/" + page, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // /api/cases/count
  getNumberOfCases: () => {
    return axios.get(API_URL + "count", {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // /api/cases/case/{id}
  getCaseById: (id) => {
    return axios.get(API_URL + "case/" + id, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // /api/cases/all-id
  getAllCaseIDs: () => {
    return axios.get(API_URL + "all-id", {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // Update case
  // /api/cases/update/{id}
  updateCase: (id, data) => {
    return axios.put(API_URL + "update/" + id, data, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // Delete case by id
  // /api/cases/delete/{id}
  deleteCase: (id) => {
    return axios.delete(API_URL + "delete/" + id, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },
};

export default caseService;
