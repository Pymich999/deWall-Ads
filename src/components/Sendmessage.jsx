import { db } from './firebase'; // Firestore instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sendMessage = async (chatId, senderId, text) => {
    try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);

        await addDoc(messagesRef, {
            senderId,
            text,
            timestamp: serverTimestamp(),
        });

        console.log('Message sent!');
    } catch (error) {
        console.error('Error sending message:', error);
    }
};
