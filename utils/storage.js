import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = 'smackamoji_leaderboard';
const PLAYER_NAME_KEY = 'smackamoji_player_name';

export const savePlayerName = async (name) => {
  try {
    await AsyncStorage.setItem(PLAYER_NAME_KEY, name);
  } catch (error) {
    console.error('Error saving player name:', error);
  }
};

export const getPlayerName = async () => {
  try {
    const name = await AsyncStorage.getItem(PLAYER_NAME_KEY);
    return name;
  } catch (error) {
    console.error('Error getting player name:', error);
    return null;
  }
};

export const saveLocalScore = async (name, score) => {
  try {
    const existingScores = await getLocalLeaderboard();
    const newScore = {
      name,
      score,
      date: new Date().toISOString(),
    };
    
    const updatedScores = [...existingScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
  } catch (error) {
    console.error('Error saving local score:', error);
  }
};

export const getLocalLeaderboard = async () => {
  try {
    const scores = await AsyncStorage.getItem(LEADERBOARD_KEY);
    return scores ? JSON.parse(scores) : [];
  } catch (error) {
    console.error('Error getting local leaderboard:', error);
    return [];
  }
};

export const clearPlayerName = async () => {
  try {
    await AsyncStorage.removeItem(PLAYER_NAME_KEY);
  } catch (error) {
    console.error('Error clearing player name:', error);
  }
}; 