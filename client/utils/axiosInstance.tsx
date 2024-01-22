import axios from "axios";

const createAxiosInstance = () => {
  return axios.create({
    baseURL: "https://sejati-dimedia-blog-api.vercel.app",
  });
};

export default createAxiosInstance;
