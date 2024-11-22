import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Custom Header */}
      <header className="w-full bg-blue-600 text-white py-8 px-4 rounded-b-lg shadow-md text-center">
        <h1 className="text-3xl font-bold">Welcome to deWallAds</h1>
        <p className="text-sm mt-2">Sign in or create an account to get started</p>
      </header>

      {/* Page Content */}
      <div className="flex-grow flex items-center justify-center w-full px-6">
        <Outlet /> {/* Render nested routes here */}
      </div>
    </div>
  );
};

export default AuthLayout;
