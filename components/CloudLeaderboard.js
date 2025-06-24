import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated,
  Alert,
  Modal,
  StatusBar 
} from 'react-native';
import { getTopScores, getTodayTopScores } from '../utils/firebaseStorage';
import { getLocalLeaderboard } from '../utils/storage';

export default function CloudLeaderboard({ visible, onClose, currentPlayerName }) {
  const [scores, setScores] = useState([]);
  const [todayScores, setTodayScores] = useState([]);
  const [localScores, setLocalScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('global'); // 'global', 'today', 'local'
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (visible) {
      fetchAllScores();
      // Reset animation first, then animate in
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const fetchAllScores = async () => {
    setLoading(true);
    try {
      const [globalScores, dailyScores] = await Promise.all([
        getTopScores(10),
        getTodayTopScores(10)
      ]);
      setScores(globalScores);
      setTodayScores(dailyScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      Alert.alert('Connection Error', 'Unable to load leaderboard. Check your internet connection.');
    }
    setLoading(false);
  };

  const getCurrentScores = () => {
    switch (activeTab) {
      case 'global': return scores;
      case 'today': return todayScores;
      default: return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'global': return '🌍 Global Leaders';
      case 'today': return '📅 Today\'s Best';
      default: return 'Leaderboard';
    }
  };

  const getRankEmoji = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  const isCurrentPlayer = (playerName) => {
    return playerName === currentPlayerName;
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.8)" barStyle="light-content" />
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouch} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
        <View style={styles.header}>
          <Text style={styles.title}>{getTabTitle()}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'global' && styles.activeTab]}
            onPress={() => setActiveTab('global')}
          >
            <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
              🌍 Global
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'today' && styles.activeTab]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
              📅 Today
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : getCurrentScores().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.noScores}>
              {activeTab === 'today' 
                ? 'No scores today yet!\nBe the first to play!' 
                : 'No global scores yet!\nBe the first player!'
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={getCurrentScores()}
            keyExtractor={(item, index) => item.id || index.toString()}
            style={styles.scoresList}
            contentContainerStyle={styles.scoresContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: score, index }) => (
              <View 
                style={[
                  styles.scoreItem,
                  isCurrentPlayer(score.name) && styles.currentPlayerItem
                ]}
              >
                <View style={styles.rankContainer}>
                  <Text style={[
                    styles.rank,
                    index < 3 && styles.topRank
                  ]}>
                    {getRankEmoji(index)}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={[
                    styles.playerName,
                    isCurrentPlayer(score.name) && styles.currentPlayerName
                  ]}>
                    {score.name}
                    {isCurrentPlayer(score.name) && ' (You)'}
                  </Text>
                  {activeTab === 'local' && score.date && (
                    <Text style={styles.scoreDate}>
                      {new Date(score.date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.playerScore,
                  isCurrentPlayer(score.name) && styles.currentPlayerScore
                ]}>
                  {score.score}
                </Text>
              </View>
            )}
          />
        )}

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchAllScores}>
            <Text style={styles.refreshText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: '#FFE4E1',
    borderRadius: 25,
    padding: 20,
    width: '92%',
    maxWidth: 420,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  closeText: {
    fontSize: 20,
    color: '#FF6B6B',
    fontFamily: 'Poppins-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 15,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Poppins-Regular',
    color: '#666',
    fontSize: 13,
  },
  activeTabText: {
    color: '#FF6B6B',
    fontFamily: 'Poppins-Bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  scoresList: {
    flex: 1,
    marginHorizontal: -5,
  },
  scoresContent: {
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  noScores: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 24,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentPlayerItem: {
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  rankContainer: {
    width: 45,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  topRank: {
    fontSize: 20,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  currentPlayerName: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  scoreDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
  playerScore: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
  },
  currentPlayerScore: {
    color: 'white',
  },
  bottomButtons: {
    marginTop: 15,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  refreshText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
}); 