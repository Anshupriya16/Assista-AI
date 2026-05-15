import axios from "axios";

// Base URL of your backend
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ==========================
// CHAT API
// ==========================
export const sendMessageToBot = async (message, token, conversationId) => {
  const res = await API.post(
    "/chat",
    { message, conversationId },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );

  return res.data;
};

export const getHistory = async (token) => {
  const res = await API.get("/chat/history", {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return res.data;
};

// ==========================
// LOGIN API
// ==========================
export const loginUser = async (email, password) => {
  const res = await API.post("/login", {
    email,
    password,
  });

  return res.data;
};

// ==========================
// SIGNUP API
// ==========================
export const signupUser = async (name, email, password) => {
  const res = await API.post("/signup", {
    name,
    email,
    password,
  });

  return res.data;
};

export const getConversations = async (token) => {
  const res = await API.get("/chat/conversations", {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return res.data;
};

export const getConversation = async (conversationId, token) => {
  const res = await API.get(`/chat/conversations/${conversationId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  return res.data;
};

export const getProfile = async (token) => {
  const res = await API.get("/profile", {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

  return res.data;
};

export const updateProfile = async (name, token) => {
  const res = await API.put(
    "/profile",
    { name },
    { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
  );

  return res.data;
};

export const updateSettings = async (settings, token) => {
  const res = await API.put("/settings", settings, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

  return res.data;
};

export const clearHistory = async (token) => {
  const res = await API.delete("/chat/history", {
    headers: { Authorization: token ? `Bearer ${token}` : undefined },
  });

  return res.data;
};
/*
import axios from "axios";

const API = "http://localhost:5000/api";

// LOGIN
export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

// SIGNUP
export const signupUser = (data) =>
  axios.post(`${API}/auth/signup`, data);

// SEND MESSAGE
export const sendMessage = (data, token) =>
  axios.post(`${API}/chat`, data, {
    headers: { Authorization: token }
  });

// GET HISTORY
export const getHistory = (token) =>
  axios.get(`${API}/chat/history`, {
    headers: { Authorization: token }
  });*/
