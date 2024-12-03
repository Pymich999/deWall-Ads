import { db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const listenToMessages = (chatId, callback) => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(messages);
    });

    return unsubscribe; // Call this to stop listening when the component unmounts
};
