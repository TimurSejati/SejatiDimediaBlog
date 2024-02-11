import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: null,
  error: null,
  loading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    getAllPosts: (state, action) => {
      state.loading = true;
      state.error = null;
      state.posts = action.payload;
    },
  },
});

export const { getAllPosts } = postSlice.actions;

export default postSlice.reducer;
