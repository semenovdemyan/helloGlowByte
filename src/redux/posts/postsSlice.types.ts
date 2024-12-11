export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostsState {
  posts: Post[];
  selectedPosts: number[];
  loading: boolean;
  sortDirection: 'ascending' | 'descending';
}
