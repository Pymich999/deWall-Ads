import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="admin-layout bg-gray-100 min-h-screen">
            <header className="bg-blue-900 text-white p-4">
                <h1 className="text-xl font-bold text-center">Admin Panel</h1>
            </header>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
