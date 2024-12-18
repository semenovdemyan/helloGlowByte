import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostsList } from './posts/pages';
import { PostDetails } from './posts/pages';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/post/:id" element={<PostDetails />} />
      </Routes>
    </Router>
  );
};
