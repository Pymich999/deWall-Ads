import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
    listenToMessages,
    sendMessage,
    fetchUserChats,
    fetchUserName,
} from "../firestoreFunctions";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatList, setChatList] = useState([]);
    const [chatTitles, setChatTitles] = useState({});
    const [selectedChatId, setSelectedChatId] = useState(null);
    const navigate = useNavigate();

    const messagesEndRef = useRef(null); // Ref for scrolling to the bottom of messages

    // Scroll to bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!currentUser) return;

        fetchUserChats(currentUser.uid)
            .then((chats) => setChatList(chats))
            .catch((err) => console.error("Error fetching user chats:", err));
    }, [currentUser]);

    useEffect(() => {
        if (!chatList.length || !currentUser) return;

        const fetchTitles = async () => {
            const titles = {};
            for (const chat of chatList) {
                const otherUserId = chat.participants.find(
                    (id) => id !== currentUser.uid
                );
                try {
                    const name = await fetchUserName(otherUserId);
                    titles[chat.id] = name;
                } catch {
                    titles[chat.id] = "Loading...";
                }
            }
            setChatTitles(titles);
        };
        fetchTitles();
    }, [chatList, currentUser]);

    useEffect(() => {
        if (!selectedChatId || !currentUser) return;

        const unsubscribe = listenToMessages(selectedChatId, setMessages);
        return () => unsubscribe();
    }, [selectedChatId, currentUser]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await sendMessage(selectedChatId, currentUser.uid, newMessage.trim());
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const renderChatList = () => (
        <div className="bg-white p-4 h-screen overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">Conversations</h2>
            {chatList.map((chat) => (
                <button
                    key={chat.id}
                    className="block w-full text-left p-2 rounded-lg bg-gray-100 hover:bg-blue-100 mb-2"
                    onClick={() => setSelectedChatId(chat.id)}
                >
                    Chat with {chatTitles[chat.id] || "Loading..."}
                </button>
            ))}
        </div>
    );

    const renderMessages = () => (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center bg-blue-600 text-white p-4 z-50">
                <button className="mr-4" onClick={() => setSelectedChatId(null)}>
                    🔙
                </button>
                <h2 className="font-bold text-lg">{chatTitles[selectedChatId]}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg w-fit max-w-[70%] ${message.senderId === currentUser.uid
                            ? "bg-blue-500 text-white self-end"
                            : "bg-gray-200 text-black self-start"
                            }`}
                    >
                        <p>{message.text}</p>
                        <span className="block text-xs text-right text-gray-400">
                            {new Date(
                                message.timestamp?.seconds * 1000
                            ).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Input */}
            <div className="bg-white z-50">
                <div className="flex items-center space-x-2 p-4">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 p-3 rounded-lg"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        style={{
                            paddingBottom: "env(safe-area-inset-bottom)", // For iOS safe areas
                        }}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="overflow-hidden"> {/* Prevent main page scroll */}
            {selectedChatId ? renderMessages() : renderChatList()}
        </div>
    );
};

export default ChatPage;


