import createAxiosInstance from "../utils/axiosInstance";

export const signIn = async (formData) => {
  try {
    const data = await createAxiosInstance().post(`/api/auth/signin`, formData);
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const signUp = async (formData) => {
  try {
    const data = await createAxiosInstance().post(`/api/auth/signup`, formData);
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
