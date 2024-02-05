import createAxiosInstance from "../utils/axiosInstance";

export const getAllCategories = async () => {
  try {
    const { data } = await createAxiosInstance().get(`/api/category`);

    console.log(data, "from service");
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createCategory = async (token, categoryData) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = await createAxiosInstance().post(
      `/api/category`,
      categoryData,
      config
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    const data = await createAxiosInstance().delete(`/api/category/${id}`);

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateCategory = async (token, id, dataEdit) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = await createAxiosInstance().put(
      `/api/category/${id}`,
      dataEdit,
      config
    );

    return { data };
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
