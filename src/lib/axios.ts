import { LogOutAction } from "@/actions/logOutAction";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
   
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

    console.log("logout")
      try {
        await LogOutAction();
      } finally {
        window.location.href = "/login"; 
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;