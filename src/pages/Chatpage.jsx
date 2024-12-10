import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { listenToMessages, sendMessage, fetchUserChats, fetchUserName } from "../firestoreFunctions";
import { useNavigate, useParams } from "react-router-dom";

const ChatPage = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatList, setChatList] = useState([]);
    const [chatTitles, setChatTitles] = useState({});
    const [selectedChatId, setSelectedChatId] = useState(null); // To track selected conversation
    const navigate = useNavigate();

    // Fetch user's chat list on load
    useEffect(() => {
        if (!currentUser) return;

        fetchUserChats(currentUser.uid)
            .then((chats) => {
                setChatList(chats);
            })
            .catch((err) => console.error("Error fetching user chats:", err));
    }, [currentUser]);

    // Fetch chat titles for the conversation list
    useEffect(() => {
        if (!chatList.length || !currentUser) return;

        const fetchTitles = async () => {
            const titles = {};
            for (const chat of chatList) {
                const otherUserId = chat.participants.find((id) => id !== currentUser.uid);
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

    // Listen to messages for the selected conversation
    useEffect(() => {
        if (!selectedChatId || !currentUser) return;

        const unsubscribe = listenToMessages(selectedChatId, setMessages);
        return () => unsubscribe();
    }, [selectedChatId, currentUser]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await sendMessage(selectedChatId, currentUser.uid, newMessage.trim());
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Render the conversation list
    const renderChatList = () => (
        <div className="bg-white p-4 space-y-4" style={{ height: "100vh", overflowY: "auto" }}>
            <h2 className="font-bold text-lg">Conversations</h2>
            {chatList.map((chat) => (
                <button
                    key={chat.id}
                    className="block w-full text-left p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setSelectedChatId(chat.id)}
                >
                    Chat with {chatTitles[chat.id] || "Loading..."}
                </button>
            ))}
        </div>
    );

    // Render the selected conversation
    const renderMessages = () => (
        <>
            <div className="flex items-center bg-white p-4 border-b">
                <button className="text-blue-600 font-bold" onClick={() => setSelectedChatId(null)}>
                    Back
                </button>
                <span className="ml-4 font-bold">Chat with {chatTitles[selectedChatId]}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ height: "calc(100vh - 60px)" }}>
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
                            {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-4 flex items-center space-x-2 border-t" style={{ height: "60px" }}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 p-2 rounded-md"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex">
            {selectedChatId ? renderMessages() : renderChatList()}
        </div>
    );
};

export default ChatPage;
