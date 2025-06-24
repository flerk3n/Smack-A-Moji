import React from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';

export default function Timer({ time }) {
  const timeColor = time <= 10 ? '#FF0000' : time <= 20 ? '#FF8C00' : '#FF6B6B';
  const isUrgent = time <= 10;
  
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (isUrgent) {
      // Pulsing animation when time is critical
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValue.setValue(1);
    }
  }, [isUrgent]);

  return (
    <View style={styles.timerContainer}>
      <Animated.View 
        style={[
          styles.timerWrapper,
          { transform: [{ scale: animatedValue }] }
        ]}
      >
        <Text style={styles.timerEmoji}>⏱️</Text>
        <Text style={[styles.timer, { color: timeColor }]}>
          {time}s
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  timer: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
}); 