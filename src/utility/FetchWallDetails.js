import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firebase Firestore instance

const fetchWallDetails = async (id) => {
  try {
    const wallQuery = query(
      collection(db, "dewall", "database", "wall_list"),
      where("__name__", "==", id)
    );
    const querySnapshot = await getDocs(wallQuery);

    if (!querySnapshot.empty) {
      const wallDoc = querySnapshot.docs[0];
      console.log("Fetched Wall Details:", wallDoc.data()); // Debug log
      return { id: wallDoc.id, ...wallDoc.data() };
    } else {
      throw new Error("Wall not found");
    }
  } catch (error) {
    console.error("Error fetching wall details:", error);
    throw error;
  }
};

export default fetchWallDetails

