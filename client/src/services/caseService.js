// services/caseService.js
import axios from 'axios';

// const API_URL = "http://localhost:3001/api/cases/";
const API_URL = process.env.REACT_APP_API_URL + '/cases/';

const caseService = {
  // Create new case
  // POST: /api/cases
  createCase: (data) => {
    return axios.post(API_URL, data, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // /api/cases/page/{limit}/{page}
  getAllCases: (size, page, caseKeyword) => {
    return axios.get(
      API_URL + 'list/' + size + '/' + page + '/' + caseKeyword,
      {
        headers: {
          Authorization:
            'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
        },
      }
    );
  },

  // /api/cases/count
  getNumberOfCases: () => {
    return axios.get(API_URL + 'count', {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // api/cases/count/keyword/{searchKeyword}
  getNumberOfCasesByKeyword: (searchKeyword) => {
    return axios.get(API_URL + 'count/keyword/' + searchKeyword, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // /api/cases/case/{id}
  getCaseById: (id, isLabel) => {
    return axios.get(API_URL + 'case/' + isLabel + '/' + id, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // /api/cases/all-id
  getAllCaseIDs: (isLabel) => {
    return axios.get(API_URL + 'all-id' + '/' + isLabel, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // Update case
  // /api/cases/update/{id}
  updateCase: (id, data) => {
    return axios.put(API_URL + 'update/' + id, data, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // Delete case by id
  // /api/cases/delete/{id}
  deleteCase: (id) => {
    return axios.delete(API_URL + 'delete/' + id, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
      },
    });
  },

  // Upload case list file, then mark case to is_hide = false
  // /api/cases/mark-case
  markCase: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('File being sent:', file);

    return axios.post(API_URL + 'mark-case', formData, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('user')).token,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default caseService;
