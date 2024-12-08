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
        <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
            {/* Sidebar (Conversation List) */}
            <div
                className="bg-white border-r w-full md:w-1/4 md:flex flex-col p-4 space-y-4"
                style={{
                    height: "100vh", // Ensure full viewport height
                    overflowY: "auto", // Enable independent scrolling
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
                        {/* Messages Display */}
                        <div
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                            style={{
                                height: "calc(100vh - 80px)", // Reserve space for input box
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

                        {/* Input Box */}
                        <div
                            className="bg-white p-4 flex items-center space-x-2 border-t"
                            style={{
                                height: "80px", // Fixed height for the input box
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
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );

};

export default ChatPage;

