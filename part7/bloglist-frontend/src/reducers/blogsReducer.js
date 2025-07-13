import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogService.js";

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.blogs;
    },
    appendBlog(state, action) {
      return state.concat(action.payload.blog);
    },
    replaceBlog(state, action) {
      return state.map(b => b.id === action.payload.blog.id ? action.payload.blog : b);
    },
    removeBlog(state, action) {
      return state.filter(b => b.id !== action.payload.id);
    },
  }
});

const { setBlogs, appendBlog, replaceBlog, removeBlog } = blogsSlice.actions;

export default blogsSlice.reducer;

export function fetchBlogs() {
  return async function (dispatch) {
    const blogs = await blogService.getAll();
    dispatch(setBlogs({ blogs }));
  };
}

export function createBlog(userToken, blog) {
  return async function (dispatch) {
    const newBlog = await blogService.createNew(userToken, blog);
    dispatch(appendBlog({ blog: newBlog }));
  };
}

export function likeBlog(blog) {
  return async function (dispatch) {
    const likedBlog = await blogService.updateExisting({ ...blog, likes: blog.likes + 1 });
    dispatch(replaceBlog({ blog: likedBlog }));
  };
}

export function commentOnBlog(blog, comment) {
  return async function (dispatch) {
    const commentedBlog = await blogService.updateExisting({ ...blog, comments: blog.comments.concat(comment) });
    dispatch(replaceBlog({ blog: commentedBlog }));
  };
}

export function deleteBlog(userToken, id) {
  return async function (dispatch) {
    await blogService.deleteExisting(userToken, id);
    dispatch(removeBlog({ id }));
  };
}
