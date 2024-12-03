import { db } from './firebase';
import { collection, doc, setDoc, getDocs, getDoc, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Firestore Functions
import { getAuth } from "firebase/auth";

export const createOrGetChat = async (recipientUserId) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("User not logged in");

    const chatsRef = collection(db, "chats");

    // Query for existing chats where the current user is a participant
    const q = query(chatsRef, where("participants", "array-contains", currentUser.uid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // No chats found
        return [];
    }

    // Return chats as an array of chat objects (or IDs)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const createChat = async (recipientUserId) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) throw new Error("User not logged in");

        const chatsRef = collection(db, "chats");

        // Create a new chat
        const newChatRef = await addDoc(chatsRef, {
            participants: [currentUser.uid, recipientUserId],
            createdAt: serverTimestamp(),
        });

        return newChatRef.id;
    };
};



export const fetchChatTitle = async (chatId, currentUserId) => {
    const chatRef = doc(db, "chats", chatId);
    const chatSnapshot = await getDoc(chatRef);

    if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.data();
        return chatData.titles[currentUserId]; // Get the title for the current user
    }
    return "Untitled Chat";
};


// Function to send a message
export const sendMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        await addDoc(messagesRef, {
            senderId,
            text,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Function to listen to messages in real time
export const listenToMessages = (chatId, callback) => {
    console.log("listenToMessages called with chatId:", chatId);

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    console.log("Query created for path:", `chats/${chatId}/messages`);

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            console.log("Snapshot listener triggered.");
            if (snapshot.empty) {
                console.log("No messages found in this chat.");
            } else {
                const messages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched messages:", messages);
                callback(messages);
            }
        },
        (error) => {
            console.error("Error fetching messages:", error);
        }
    );

    return unsubscribe;
};




// Function to fetch all user chats
export const fetchUserChats = async (userId) => {
    try {
        const chatsRef = collection(db, "chats");
        const userChatsQuery = query(chatsRef, where("participants", "array-contains", userId));
        const querySnapshot = await getDocs(userChatsQuery);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                title: data.titles?.[userId] || "Untitled Chat",
            };
        });
    } catch (error) {
        console.error("Error fetching user chats:", error);
        throw error;
    }
};


export const fetchUserName = async (userId) => {
    try {
        const userDocRef = doc(db, "dewall", "user_node", "profile", userId); // Adjust this path to match your Firestore structure
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data().full_name || "Unknown User";
        } else {
            console.warn(`User profile not found for UID: ${userId}`);
            return "Unknown User";
        }
    } catch (error) {
        console.error("Error fetching user name:", error);
        throw error;
    }
};