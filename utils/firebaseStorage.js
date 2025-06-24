import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const LEADERBOARD_COLLECTION = 'leaderboard';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Retry function for network operations
const retryOperation = async (operation, retries = MAX_RETRIES) => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && (error.code === 'unavailable' || error.code === 'deadline-exceeded')) {
      console.log(`Retrying operation, ${retries} attempts left...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
};

export const saveScoreToCloud = async (playerName, score) => {
  // Input validation
  if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
    console.error('Invalid player name');
    return false;
  }
  
  if (!Number.isInteger(score) || score < 0 || score > 1000) {
    console.error('Invalid score value');
    return false;
  }

  try {
    const operation = () => addDoc(collection(db, LEADERBOARD_COLLECTION), {
      name: playerName.trim().substring(0, 20), // Ensure max length
      score: parseInt(score),
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    });

    const docRef = await retryOperation(operation);
    console.log('Score saved with ID: ', docRef.id);
    return true;
  } catch (error) {
    console.error('Error saving score to cloud:', error);
    
    // Log specific error types for debugging
    if (error.code === 'permission-denied') {
      console.error('Permission denied - check Firestore rules');
    } else if (error.code === 'unavailable') {
      console.error('Firebase service unavailable');
    } else if (error.code === 'quota-exceeded') {
      console.error('Firebase quota exceeded');
    }
    
    return false;
  }
};

export const getTopScores = async (limitCount = 10) => {
  if (limitCount > 100) limitCount = 100; // Prevent excessive queries
  
  try {
    const operation = () => getDocs(query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(limitCount)
    ));

    const querySnapshot = await retryOperation(operation);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Validate data before adding
      if (data.name && typeof data.score === 'number') {
        scores.push({
          id: doc.id,
          name: data.name,
          score: data.score,
          date: data.date,
          timestamp: data.timestamp
        });
      }
    });
    
    return scores;
  } catch (error) {
    console.error('Error getting top scores:', error);
    return [];
  }
};

export const getTodayTopScores = async (limitCount = 10) => {
  if (limitCount > 100) limitCount = 100; // Prevent excessive queries
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const operation = () => getDocs(query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(limitCount * 3) // Get more to filter by date
    ));

    const querySnapshot = await retryOperation(operation);
    const scores = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Validate data and filter by today's date
      if (data.name && typeof data.score === 'number' && data.date === today) {
        scores.push({
          id: doc.id,
          name: data.name,
          score: data.score,
          date: data.date,
          timestamp: data.timestamp
        });
      }
    });
    
    return scores.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting today\'s top scores:', error);
    return [];
  }
};

// Health check function
export const checkFirebaseConnection = async () => {
  try {
    const testQuery = query(
      collection(db, LEADERBOARD_COLLECTION),
      limit(1)
    );
    await getDocs(testQuery);
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
}; 