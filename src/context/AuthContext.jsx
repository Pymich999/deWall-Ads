import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

// Create the context
const AuthContext = createContext();

// Provide the AuthContext to the app
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Update state with the user
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const value = {
        currentUser, // The authenticated user object
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Create a hook to access AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
