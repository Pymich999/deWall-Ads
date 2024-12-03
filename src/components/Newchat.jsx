import { db } from './firebase'; // Firestore instance
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const createOrGetChat = async (user1Id, user2Id) => {
    try {
        // Generate a consistent chatId (sorted user IDs ensure uniqueness)
        const chatId = [user1Id, user2Id].sort().join('_');
        const chatRef = doc(db, 'chats', chatId);

        // Check if the chat already exists
        const chatSnapshot = await getDoc(chatRef);

        if (!chatSnapshot.exists()) {
            // Create the chat document if it doesn’t exist
            await setDoc(chatRef, {
                participants: [user1Id, user2Id],
            });
            console.log('Chat created!');
        } else {
            console.log('Chat already exists.');
        }

        return chatId; // Return the chatId for further use
    } catch (error) {
        console.error('Error creating or getting chat:', error);
    }
};
