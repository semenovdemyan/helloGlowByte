import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostsList } from './pages';
import { PostDetails } from './pages';

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
