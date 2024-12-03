import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomepageLayout from "./layouts/Homepagelayout";
import AdminLayout from "./layouts/AdminLayout"; // New Admin Layout
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ChatPage from "./pages/Chatpage";
import Authcomponent from "./components/Authcomponent";
import Addwall from "./pages/Addwall";
import Searchwall from "./pages/Searchwall";
import WallDetails from "./components/Walldetails";
import AdminPanel from "./pages/AdminPanel";
import RequireAdminAuth from "./components/RequireAdminAuth"; // Admin Auth Guard

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
          <Route path="/chats/:chatId" element={<ChatPage />} />
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

        {/* Admin Layout */}
        <Route
          element={
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          }
        >
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
