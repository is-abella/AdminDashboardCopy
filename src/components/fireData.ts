// src/fireData.ts
import { getDatabase, ref, get } from 'firebase/database';
import firebaseApp from './firebase.ts';
import { Person } from './types';

const fetchDataFromFirebase = async (): Promise<Person[] | null> => {
  const db = getDatabase(firebaseApp);
  const dataRef = ref(db, '/'); // Replace '/' with your actual collection name

  try {
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      const data: Person[] = snapshot.val();
      console.log('Data fetched successfully:', data);
      return data;
    } else {
      console.log('No data available');
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export default fetchDataFromFirebase;



/*import { getDatabase, ref, get } from 'firebase/database';
import firebaseApp from './firebase.js';

const fetchDataFromFirebase = async () => {
    const db = getDatabase(firebaseApp);
    const dataRef = ref(db, '/'); // Replace 'data' with your actual collection name
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Data fetched successfully:', data);
        return data;
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  };
  
  export default fetchDataFromFirebase;
*/
