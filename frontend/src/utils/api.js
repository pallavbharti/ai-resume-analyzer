import axios from "axios";

export const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const createClientId = () => {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "c-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
};

let memoryClientId = null;

const getClientId = () => {
  try {
    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
      clientId = createClientId();
      localStorage.setItem("clientId", clientId);
    }
    return clientId;
  } catch (err) {
    if (!memoryClientId) memoryClientId = createClientId();
    return memoryClientId;
  }
};

const api = axios.create({ baseURL: BASE_URL, timeout: 90000 });

api.interceptors.request.use((config) => {
  config.headers["X-Client-Id"] = getClientId();
  return config;
});

export const getErrorMessage = (err) => {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  if (err.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again";
  }
  return "Could not reach the server. It may be waking up, please try again in a minute";
};

export default api;
