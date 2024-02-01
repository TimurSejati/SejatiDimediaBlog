import createAxiosInstance from "../utils/axiosInstance";

export const addComment = async ({ dataComment }) => {
  try {
    const data = await createAxiosInstance().post(
      `/api/comment/create`,
      dataComment
    );
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
