import createAxiosInstance from "../utils/axiosInstance";

export const getAllPosts = async (
  searchKeyword = "",
  userId = "",
  page = 1,
  limit = 6
) => {
  try {
    const { data } = await createAxiosInstance().get(
      `/api/post2?userId=${userId}&${searchKeyword}&page=${page}&limit=${
        limit * page
      }`
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getAllPostsFront = async (
  searchKeyword = "",
  userId = "",
  page = 1,
  limit = 6
) => {
  try {
    const { data } = await createAxiosInstance().get(
      `/api/post2/front?userId=${userId}&${searchKeyword}&page=${page}&limit=${
        limit * page
      }`
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async (slug) => {
  try {
    const { data } = await createAxiosInstance().get(`/api/post2/${slug}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createPost = async ({ dataPost, token }) => {
  console.log(dataPost, "FROM SERVICE");
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // const { data } = await axios.put(`/api/posts/${slug}`, dataPost, config);
    const { data } = await createAxiosInstance().post(
      `/api/post2`,
      dataPost,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updatePost = async ({ updatedData, slug, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // const { data } = await axios.put(`/api/posts/${slug}`, updatedData, config);
    const { data } = await createAxiosInstance().put(
      `/api/post2/${slug}`,
      updatedData,
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deletePost = async (postSlug, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await createAxiosInstance().delete(
      `/api/post2/${postSlug}`,
      config
    );
    return res;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const likePost = async ({ postId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = await createAxiosInstance().put(
      `/api/post2/likePost/${postId}`,
      {},
      config
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updatePostViews = async ({ postId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Viewing-Post": token ? "" : "next",
      },
    };

    const data = await createAxiosInstance().put(
      `/api/post2/view/${postId}`,
      {},
      config
    );

    console.log(data);

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const bookmarkPost = async ({ postId, token }) => {
  try {
    console.log("connect service bookmark");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = await createAxiosInstance().put(
      `/api/user/bookmark/${postId}`,
      {},
      config
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
