// services/authService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const API_URL = "http://localhost:3001/api/users/";
const API_URL = process.env.REACT_APP_API_URL + "/users/";

const register = (username, password, role) => {
  return axios.post(API_URL + "signup", { username, password, role });
};

const login = async (username, password) => {
  const response = await axios.post(API_URL + "login", { username, password });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user"); // Assuming user token/info is stored in local storage
  window.location = "/login"; // Redirect to login after logout
};

const getUserList = async () => {
  return await axios.get(API_URL + "list", {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const deleteUser = async (id) => {
  return await axios.delete(API_URL + "delete/" + id, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const updateUser = async (id, userData) => {
  return await axios.put(API_URL + "update/" + id, userData, {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
    },
  });
};

const changePassword = async (username, newPassword) => {
  return await axios.put(
    API_URL + "change-password/",
    { username, password: newPassword },
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    }
  );
};

const getToken = () => {
  if (!localStorage.getItem("user")) {
    return null;
  }

  const token = JSON.parse(localStorage.getItem("user")).token;
  const decoded = jwtDecode(token);

  return decoded;
};

const getUserRole = () => {
  // Get token from local storage
  const token = getToken();
  if (!token) return null;

  // Get user role from token
  const user = token.user.role;

  return user;
};

const getUserName = () => {
  // Get token from local storage
  const token = getToken();
  if (!token) return null;

  // Get user name from token
  const userName = token.user.username;

  return userName;
};

const checkTokenExpiration = () => {
  const token = getToken();

  console.log(`Checking token expiration... (${token.exp})`);

  // Check if token is expired
  if (token.exp * 1000 < new Date().getTime()) {
    logout();
    console.log("Token is expired, logging out...!");
  }
};

export default {
  register,
  login,
  logout,
  deleteUser,
  updateUser,
  changePassword,
  checkTokenExpiration,
  getUserList,
  getUserRole,
  getUserName,
};
