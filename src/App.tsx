import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PostList from "./components/PostList";
import PostDetails from "./components/PostDetails";
import UserProfile from "./components/UserProfile";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
