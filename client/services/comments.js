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

export const getAllComments = async ({ postId }) => {
  try {
    const { data } = await createAxiosInstance().get(
      `/api/comment/getPostComments/${postId}`
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const editComment = async ({ commentId, dataEditComment }) => {
  try {
    const data = await createAxiosInstance().put(
      `/api/comment/editComment/${commentId}`,
      dataEditComment
    );
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteComment = async ({ commentId }) => {
  try {
    const data = await createAxiosInstance().delete(
      `/api/comment/deleteComment/${commentId}`
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const likeComment = async ({ commentId }) => {
  try {
    const data = await createAxiosInstance().put(
      `/api/comment/likeComment/${commentId}`
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
