import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen pt-16 pb-20">
        <Outlet /> {/* This is where nested routes will render */}
      </div>
      <Navbar />
    </>
  );
};

export default MainLayout;
