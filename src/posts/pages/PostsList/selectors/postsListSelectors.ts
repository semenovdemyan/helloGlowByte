import { createSelector } from "@reduxjs/toolkit";

export const postReducer = (state) => {
  return state.postsReducer;
};

export const postsSelector = createSelector(
  postReducer,
  (postsReducer) => {
    return postsReducer.posts.toSorted((a, b) => {
      if (postsReducer.sortDirection === "ascending") {
        return a.userId - b.userId;
      } else {
        return b.userId - a.userId;
      }
    });
  },
);
