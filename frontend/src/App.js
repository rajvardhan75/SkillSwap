import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';
import MyRequestsPage from './pages/MyRequestsPage';
import PreviousWorksPage from './pages/PreviousWorksPage'; // Adjust path as needed







function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
         <Route path="/previous-works" element={<PreviousWorksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
