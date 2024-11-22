import React, { useState } from "react";
import { auth, db, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AuthComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [state, setState] = useState("");
    const [userType, setUserType] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    // Helper function to generate a device ID (placeholder)
    const generateDeviceID = () => {
        return "device_" + Math.random().toString(36).substring(2, 15);
    };

    // Handle sign-up with additional info and location
    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            // Get user's location using Geolocation API
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    // Save additional info to Firestore
                    await setDoc(doc(db, "dewall", "user_node", "profile", uid), {
                        email: user.email,
                        uid,
                        full_name: fullName,
                        mobile,
                        state,
                        user_type: userType,
                        location,
                        device_id: generateDeviceID(),
                        timestamp: new Date(),
                    });

                    console.log("User signed up and profile created.");
                    navigate("/profile"); // Redirect to profile page
                },
                (locationError) => {
                    setError("Failed to retrieve location. Please enable location services.");
                    console.error("Location Error:", locationError);
                }
            );
        } catch (error) {
            console.error("Error signing up:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle login with email and password
    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in.");
            navigate("/profile"); // Redirect to profile page
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle login with Google
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("User logged in with Google.");
            navigate("/profile");
        } catch (error) {
            console.error("Error with Google Sign-In:", error);
            setError(error.message);
        }
    };

    return (
        <div className="auth-container p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">{isSignUp ? "Create Account" : "Login"}</h2>

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
            />

            <button onClick={isSignUp ? handleSignUp : handleLogin} disabled={loading} className="auth-button bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
                {loading ? (isSignUp ? "Signing Up..." : "Logging In...") : (isSignUp ? "Sign Up" : "Login")}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <button onClick={handleGoogleSignIn} className="google-signin-button bg-red-500 text-white px-4 py-2 rounded w-full mt-2">
                Sign In with Google
            </button>

            <p onClick={toggleAuthMode} className="auth-toggle-link text-blue-500 cursor-pointer mt-4 text-center">
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Create one"}
            </p>
        </div>
    );
};

export default AuthComponent;
