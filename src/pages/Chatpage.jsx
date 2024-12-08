import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { listenToMessages, sendMessage, fetchUserChats, fetchUserName } from "../firestoreFunctions"; // Firestore helper functions
import { useNavigate, useParams } from "react-router-dom";

const ChatPage = () => {
    const { currentUser } = useAuth(); // Logged-in user
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatList, setChatList] = useState([]); // List of chats
    const [chatTitles, setChatTitles] = useState({}); // Object to hold chat titles for each chat
    const { chatId } = useParams(); // Get chatId from URL
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    // Dynamically determine if the screen is mobile-sized
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Mobile if width is less than 768px
        };
        handleResize(); // Initialize on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch the user's chat list
    useEffect(() => {
        if (!currentUser) return;

        fetchUserChats(currentUser.uid)
            .then((chats) => {
                setChatList(chats);

                // Automatically navigate to the first chat if no chatId is provided
                if (!chatId && chats.length > 0) {
                    navigate(`/chats/${chats[0].id}`);
                }
            })
            .catch((err) => console.error("Error fetching user chats:", err));
    }, [currentUser, chatId, navigate]);

    // Fetch chat titles for all conversations (the other participant's name)
    useEffect(() => {
        if (!chatList.length || !currentUser) return;

        const fetchTitles = async () => {
            const titles = {};

            for (const chat of chatList) {
                const otherUserId = chat.participants.find((id) => id !== currentUser.uid);
                try {
                    const name = await fetchUserName(otherUserId);
                    titles[chat.id] = name;
                } catch (err) {
                    console.error("Error fetching chat title:", err);
                    titles[chat.id] = "Loading..."; // Fallback title
                }
            }

            setChatTitles(titles);
        };

        fetchTitles();
    }, [chatList, currentUser]);

    // Listen to messages and update the chat content
    useEffect(() => {
        if (!chatId || !currentUser) return;

        const unsubscribe = listenToMessages(chatId, setMessages);
        return () => unsubscribe();
    }, [chatId, currentUser]);

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await sendMessage(chatId, currentUser.uid, newMessage.trim());
            setNewMessage(""); // Clear input field
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };
    return (
        <div className="bg-gray-100 min-h-screen">
            {isMobile ? (
                // Mobile Layout
                <div className="flex flex-col h-full">
                    {!chatId ? (
                        // Show Conversation List
                        <div
                            className="w-full bg-white border-r p-4 space-y-4"
                            style={{
                                height: "100vh", // Full viewport height for sidebar
                                overflowY: "auto", // Independent scrolling for sidebar
                            }}
                        >
                            <h2 className="font-bold text-lg">Conversations</h2>
                            {chatList.map((chat) => {
                                const chatTitle = chatTitles[chat.id] || "Loading...";
                                return (
                                    <button
                                        key={chat.id}
                                        className={`block w-full text-left p-2 rounded-md ${chat.id === chatId ? "bg-gray-200" : "hover:bg-gray-100"
                                            }`}
                                        onClick={() => navigate(`/chats/${chat.id}`)}
                                    >
                                        Chat with {chatTitle}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        // Show Chat Messages
                        <div className="flex flex-col h-full">
                            <div
                                className="flex items-center bg-white p-4 border-b"
                                style={{
                                    flexShrink: 0,
                                    height: "60px", // Back button bar height
                                }}
                            >
                                <button
                                    className="text-blue-600 font-bold"
                                    onClick={() => navigate(`/chats`)} // Navigate back to chat list
                                >
                                    Back
                                </button>
                                <span className="ml-4 font-bold">Chat with {chatTitles[chatId]}</span>
                            </div>

                            <div
                                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                                style={{
                                    height: "calc(100vh - 120px)", // Reserve space for back button and input
                                }}
                            >
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`p-3 rounded-md w-fit max-w-[75%] ${message.senderId === currentUser.uid
                                                ? "bg-blue-500 text-white self-end"
                                                : "bg-gray-300 text-black self-start"
                                            }`}
                                    >
                                        <div className="text-sm">{message.text}</div>
                                        <div className="text-xs text-gray-500 mt-1 text-right">
                                            {new Date(
                                                message.timestamp?.seconds * 1000
                                            ).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="bg-white p-4 flex items-center space-x-2 border-t"
                                style={{
                                    height: "60px", // Input box height
                                    flexShrink: 0, // Prevent collapsing
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 p-2 rounded-md"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                    onClick={handleSendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Desktop Layout
                <div className="flex h-full">
                    {/* Conversation Sidebar */}
                    <div
                        className="w-1/4 bg-white border-r p-4 space-y-4"
                        style={{
                            height: "100vh", // Full viewport height
                            overflowY: "auto", // Independent scrolling
                        }}
                    >
                        <h2 className="font-bold text-lg">Conversations</h2>
                        {chatList.map((chat) => {
                            const chatTitle = chatTitles[chat.id] || "Loading...";
                            return (
                                <button
                                    key={chat.id}
                                    className={`block w-full text-left p-2 rounded-md ${chat.id === chatId ? "bg-gray-200" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => navigate(`/chats/${chat.id}`)}
                                >
                                    Chat with {chatTitle}
                                </button>
                            );
                        })}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 flex flex-col">
                        {chatId ? (
                            <>
                                <div
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                                    style={{
                                        height: "calc(100vh - 60px)", // Reserve space for input
                                    }}
                                >
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-3 rounded-md w-fit max-w-[75%] ${message.senderId === currentUser.uid
                                                    ? "bg-blue-500 text-white self-end"
                                                    : "bg-gray-300 text-black self-start"
                                                }`}
                                        >
                                            <div className="text-sm">{message.text}</div>
                                            <div className="text-xs text-gray-500 mt-1 text-right">
                                                {new Date(
                                                    message.timestamp?.seconds * 1000
                                                ).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="bg-white p-4 flex items-center space-x-2 border-t"
                                    style={{
                                        height: "60px", // Input box height
                                        flexShrink: 0,
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 border border-gray-300 p-2 rounded-md"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                        onClick={handleSendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex justify-center items-center text-gray-500">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

};

export default ChatPage;

