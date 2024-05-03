// services/bookService.js
import axios from "axios";

// const API_URL = "http://localhost:3001/api/books/";
const API_URL = process.env.REACT_APP_API_URL + "/api/books/";

const getAllBooks = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const addBook = (bookData) => {
  return axios.post(API_URL, bookData, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const updateBook = (id, bookData) => {
  return axios.put(API_URL + id, bookData, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const deleteBook = (id) => {
  return axios.delete(API_URL + id, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

export default { getAllBooks, addBook, updateBook, deleteBook };
