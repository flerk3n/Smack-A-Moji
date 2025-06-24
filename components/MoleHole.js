import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Animated, Platform, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

// Import all available emoji moles
const moleEmojis = [
  require('../emojis/512_Animated_Emoji.webp'),
  require('../emojis/512_Animated_Emoji (1).webp'),
  require('../emojis/512_Animated_Emoji (2).webp'),
  require('../emojis/512_Animated_Emoji (3).webp'),
  require('../emojis/512_Animated_Emoji (4).webp'),
  require('../emojis/512_Animated_Emoji (5).webp'),
  require('../emojis/512_Animated_Emoji (6).webp'),
  require('../emojis/512_Animated_Emoji (7).webp'),
  require('../emojis/512_Animated_Emoji (8).webp'),
  require('../emojis/512_Animated_Emoji (9).webp'),
  require('../emojis/512_Animated_Emoji (10).webp'),
  require('../emojis/512_Animated_Emoji (11).webp'),
  require('../emojis/512_Animated_Emoji (12).webp'),
  require('../emojis/512_Animated_Emoji (13).webp'),
  require('../emojis/512_Animated_Emoji (14).webp'),
  require('../emojis/512_Animated_Emoji (15).webp'),
  require('../emojis/512_Animated_Emoji (16).webp'),
  require('../emojis/512_Animated_Emoji (17).webp'),
  require('../emojis/512_Animated_Emoji (18).webp'),
  require('../emojis/512_Animated_Emoji (19).webp'),
  require('../emojis/512_Animated_Emoji (20).webp'),
  require('../emojis/512_Animated_Emoji (21).webp'),
  require('../emojis/512_Animated_Emoji (22).webp'),
  require('../emojis/512_Animated_Emoji (23).webp'),
  require('../emojis/512_Animated_Emoji (24).webp'),
  require('../emojis/512_512_webp__512_512_.webp'),
];

// Fallback emoji characters
const fallbackEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'];

export default function MoleHole({ isActive, onHit, index }) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);
  
  // Select a consistent emoji for this hole based on index
  const selectedMole = moleEmojis[index % moleEmojis.length];
  const fallbackEmoji = fallbackEmojis[index % fallbackEmojis.length];
  
  // Debug logging
  useEffect(() => {
    if (isActive) {
      console.log(`Mole ${index} is now active!`);
    }
  }, [isActive, index]);

  useEffect(() => {
    if (isActive) {
      // Reset scale first, then animate up
      scaleValue.setValue(0);
      rotateValue.setValue(0);
      
      // Pop up animation with slight rotation
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 120,
          friction: 4,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Pop down animation
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  const handlePress = () => {
    if (isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onHit();
    }
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  return (
    <TouchableOpacity 
      style={styles.hole} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {isActive && (
        <Animated.View 
          style={{
            transform: [
              { scale: scaleValue },
              { rotate: rotation }
            ]
          }}
        >
          {!imageError ? (
            <Image 
              source={selectedMole} 
              style={styles.mole} 
              resizeMode="contain"
              onError={() => setImageError(true)}
              // Force resizing for better Android WebP support
              {...(Platform.OS === 'android' && {
                fadeDuration: 0,
                resizeMethod: 'resize'
              })}
            />
          ) : (
            <Text style={styles.fallbackEmoji}>{fallbackEmoji}</Text>
          )}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hole: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 3 },
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  mole: {
    width: 50,
    height: 50,
  },
  fallbackEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
}); 