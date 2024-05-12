import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/keywords/";

const keywordService = {
  // Get keyword list
  // GET: /api/keywords/list
  getKeywords: () => {
    return axios.get(API_URL + "list", {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // Create new keyword
  // POST: /api/keywords
  createKeyword: (data) => {
    return axios.post(API_URL, data, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // Update keyword
  // PUT: /api/keywords/update/{id}
  updateKeyword: (id, data) => {
    return axios.put(API_URL + "update/" + id, data, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },

  // Delete keyword
  // DELETE: /api/keywords/delete/{id}
  deleteKeyword: (id) => {
    return axios.delete(API_URL + "delete/" + id, {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  },
};

export default keywordService;
