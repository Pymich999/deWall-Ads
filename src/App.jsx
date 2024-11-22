import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import HomepageLayout from './layouts/Homepagelayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Authcomponent from './components/Authcomponent'; 
import Addwall from './pages/Addwall';
import Searchwall from './pages/Searchwall';
import WallDetails from './components/Walldetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add" element={<Addwall />} />
          <Route path="/search" element={<Searchwall />} />
          <Route path="/wall-details/:id" element={<WallDetails />} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Authcomponent />} />
        </Route>

        {/* Homepage Layout */}
        <Route
          path="/"
          element={
            <HomepageLayout>
              <Home />
              <WallDetails />
            </HomepageLayout>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;


