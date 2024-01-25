import axios from "axios";

const createAxiosInstance = () => {
  return axios.create({
    baseURL: "https://sejati-dimedia-blog-api.vercel.app",
    // baseURL: "http://localhost:5000",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true, // should be there
  });
};

export default createAxiosInstance;
