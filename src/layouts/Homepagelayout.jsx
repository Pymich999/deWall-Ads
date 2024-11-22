// src/layouts/HomepageLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';

const HomepageLayout = ({ children }) => {
  return (
    <div className="homepage pb-20">
      {/* Main Content */}
      <div className="flex-grow">{children}</div>

      {/* Navbar */}
      <Navbar />
    </div>
  );
};

export default HomepageLayout;

