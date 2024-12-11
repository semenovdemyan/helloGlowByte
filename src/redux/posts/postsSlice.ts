import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PostsState } from './postsSlice.types';
const initialState: PostsState = {
  posts: [],
  selectedPosts: [],
  loading: false,
  sortDirection: 'ascending',
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/posts'
  );
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    toggleSelectPost: (state, action) => {
      const id = action.payload;
      if (state.selectedPosts.includes(id)) {
        state.selectedPosts = state.selectedPosts.filter(
          (postId) => postId !== id
        );
      } else {
        state.selectedPosts.push(id);
      }
    },
    deleteSelectedPosts: (state) => {
      state.posts = state.posts.filter(
        (post) => !state.selectedPosts.includes(post.id)
      );
      state.selectedPosts = [];
    },
    toggleSortDirection: (state) => {
      state.sortDirection =
        state.sortDirection === 'ascending' ? 'descending' : 'ascending';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { toggleSelectPost, deleteSelectedPosts, toggleSortDirection } =
  postsSlice.actions;
export default postsSlice.reducer;
