import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const RequireAdminAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate("/auth"); // Redirect to login if not authenticated
                    return;
                }

                const adminDoc = await getDoc(doc(db, "admin", user.uid));
                if (adminDoc.exists()) {
                    setIsAdmin(true); // Admin verified
                } else {
                    navigate("/"); // Redirect non-admins to the homepage
                }
            } catch (error) {
                console.error("Error verifying admin:", error);
                navigate("/"); // Redirect on error
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    if (isLoading) {
        return <div className="text-center p-6">Checking admin access...</div>;
    }

    return isAdmin ? children : null; // Render children only if admin
};

export default RequireAdminAuth;
