import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const fetchWallList = async () => {
  const querySnapshot = await getDocs(collection(db, "dewall", "database", "wall_list"));
  const wallList = querySnapshot.docs.map((doc) => {
    console.log("Fetched Wall Item:", doc.data()); // Debug log
    return { id: doc.id, ...doc.data() };
  });
  return wallList;
};


export default fetchWallList;
