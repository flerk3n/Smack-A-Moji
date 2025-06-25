import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';

export default function ScoreBoard({ score }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      // Bounce animation when score increases
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevScore.current = score;
  }, [score]);

  return (
    <View style={styles.scoreContainer}>
      <Animated.View 
        style={[
          styles.scoreWrapper,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        <Text style={styles.scoreEmoji}>🏆</Text>
        <Text style={styles.scoreLabel}>Score: </Text>
        <Text style={styles.score}>{score}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scoreEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 20,
    fontFamily: 'System',
    color: '#333',
  },
  score: {
    fontSize: 24,
    fontFamily: 'System',
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
}); 