import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, setDoc, DocumentData } from 'firebase/firestore';

/**
 * Adds a new user to the Firestore database.
 * @param userId - The unique identifier for the user.
 * @param userInfo - An object containing user details (e.g., email, password, username).
 */
export const addUser = async (userId: string, userInfo: { email: string; password: string; username: string }): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), userInfo);
    console.log('User added/updated successfully');
  } catch (error) {
    console.error('Error adding user: ', error);
    throw error; // Optional: rethrow error for handling in the calling code
  }
};

/**
 * Retrieves all users from the Firestore database.
 * @returns A promise that resolves to an array of user data.
 */
export const getUsers = async (): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error retrieving users: ', error);
    throw error; // Optional: rethrow error for handling in the calling code
  }
};



