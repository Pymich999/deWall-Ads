import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AuthComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [state, setState] = useState("");
    const [userType, setUserType] = useState("");
    const [adminKey, setAdminKey] = useState(""); // Admin Key field
    const [isAdminSignUp, setIsAdminSignUp] = useState(false); // Admin sign-up toggle
    const [isSignUp, setIsSignUp] = useState(false); // General sign-up toggle
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const ADMIN_KEY = import.meta.env.VITE_SECRET_ADMIN_KEY; // Set your admin key in environment variables

    // User types for regular users
    const userTypes = [
        "Wall Owner",
        "Business/Company",
        "Vehicle Owner",
        "Advertising Company",
        "Wall Painter",
        "deWall Wall Partner",
        "Others",
    ];

    // Toggle between login and sign-up modes
    const toggleAuthMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
    };

    // Toggle between admin and user modes
    const toggleAdminMode = () => {
        setIsAdminSignUp(!isAdminSignUp);
        setIsSignUp(true); // Admins can only sign up
        setError(null);
    };

    // Handle Admin Signup
    const handleAdminSignUp = async () => {
        setLoading(true);
        setError(null);
        if (adminKey !== ADMIN_KEY) {
            setError("Invalid admin key.");
            setLoading(false);
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                ADMIN_KEY // Use admin key as password
            );
            const user = userCredential.user;
            const uid = user.uid;

            // Save admin details in Firestore
            await setDoc(doc(db,  "admin", uid), {
                name: fullName,
                role: "Manager",
            });

            console.log("Admin account created.");
            navigate("/admin-panel"); // Redirect to admin panel
        } catch (error) {
            console.error("Error creating admin account:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // General Login (Admin and Regular User)
    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            const uid = user.uid;

            // Check if the user is an admin
            const adminDoc = await getDoc(doc(db, 'admin', uid));
            if (adminDoc.exists()) {
                console.log("Admin logged in.");
                navigate("/admin-panel"); // Redirect admin to the admin panel
            } else {
                console.log("Regular user logged in.");
                navigate("/profile"); // Redirect regular user to profile/dashboard
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    // Regular User Sign-Up
    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // Save user details to Firestore
            await setDoc(doc(db, "dewall", "user_node", "profile", user.uid), {
                fullName,
                email,
                mobile,
                state,
                userType,
            });

            console.log("User account created successfully.");
            navigate("/profile"); // Redirect to user profile
        } catch (error) {
            console.error("Error creating user account:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">
                {isSignUp
                    ? isAdminSignUp
                        ? "Admin Sign-Up"
                        : "Create Account"
                    : "Login"}
            </h2>

            {isSignUp && (
                <>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="input-field my-2 p-2 border rounded w-full"
                    />
                    <PhoneInput
                        country={"in"}
                        value={mobile}
                        onChange={setMobile}
                        inputClass="w-full border rounded-md"
                        containerClass="my-2"
                    />
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="input-field my-2 p-2 border rounded w-full"
                    />
                    {!isAdminSignUp && (
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="input-field my-2 p-2 border rounded w-full"
                        >
                            <option value="">Select User Type</option>
                            {userTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    )}
                    {isAdminSignUp && (
                        <input
                            type="text"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder="Admin Key"
                            className="input-field my-2 p-2 border rounded w-full"
                        />
                    )}
                </>
            )}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field my-2 p-2 border rounded w-full"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field my-2 p-2 border rounded w-full"
                disabled={isAdminSignUp} // Password not needed for admin sign-up
            />

            <button
                onClick={
                    isSignUp
                        ? isAdminSignUp
                            ? handleAdminSignUp
                            : handleSignUp
                        : handleLogin
                }
                disabled={loading}
                className="auth-button bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
            >
                {loading
                    ? isSignUp
                        ? isAdminSignUp
                            ? "Signing Up as Admin..."
                            : "Signing Up..."
                        : "Logging In..."
                    : isSignUp
                        ? isAdminSignUp
                            ? "Sign Up as Admin"
                            : "Sign Up"
                        : "Login"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {!isAdminSignUp && (
                <p
                    onClick={toggleAuthMode}
                    className="auth-toggle-link text-blue-500 cursor-pointer mt-4 text-center"
                >
                    {isSignUp
                        ? "Already have an account? Login"
                        : "Don't have an account? Create one"}
                </p>
            )}

            {!isSignUp && (
                <p
                    onClick={toggleAdminMode}
                    className="auth-toggle-link text-blue-500 cursor-pointer mt-4 text-center"
                >
                    Admin? Sign Up Here
                </p>
            )}
        </div>
    );
};

export default AuthComponent;
