import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useAudioPlayer } from 'expo-audio';
import MoleHole from './components/MoleHole';
import ScoreBoard from './components/ScoreBoard';
import Timer from './components/Timer';
import NameInput from './components/NameInput';
import CloudLeaderboard from './components/CloudLeaderboard';
import { savePlayerName, getPlayerName, saveLocalScore } from './utils/storage';
import { saveScoreToCloud, checkFirebaseConnection } from './utils/firebaseStorage';

const NUM_HOLES = 16; // 4x4 grid

export default function App() {
  // Game state
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(30);
  const [activeIndex, setActiveIndex] = useState(null);
  const [gameRunning, setGameRunning] = useState(false);
  
  // Player and UI state
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs to track current values for timer callbacks
  const gameTimeRef = useRef(30);
  const scoreRef = useRef(0);
  
  // Initialize audio players
  const backgroundPlayer = useAudioPlayer(require('./assets/sounds/background.mp3'));
  const hitSoundPlayer = useAudioPlayer(require('./assets/sounds/mole_pop.mp3'));

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // Initialize app and check for existing player name
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Firebase connection
        console.log('🔥 Testing Firebase connection...');
        const firebaseConnected = await checkFirebaseConnection();
        if (firebaseConnected) {
          console.log('✅ Firebase connection successful!');
        } else {
          console.log('❌ Firebase connection failed!');
        }
        
        const savedName = await getPlayerName();
        if (savedName) {
          setPlayerName(savedName);
          setIsInitialized(true);
        } else {
          setShowNameInput(true);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setShowNameInput(true);
        setIsInitialized(true);
      }
    };

    if (fontsLoaded) {
      initializeApp();
    }
  }, [fontsLoaded]);

  // Configure background music
  useEffect(() => {
    if (backgroundPlayer) {
      backgroundPlayer.loop = true;
      backgroundPlayer.volume = 0.3;
    }
  }, [backgroundPlayer]);

  // Keep refs in sync with state
  useEffect(() => {
    gameTimeRef.current = gameTime;
  }, [gameTime]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Advanced mole spawning system with fake-outs and multiple moles
  useEffect(() => {
    let spawnTimeouts = [];
    let moleTimeouts = [];
    
    const clearAllTimeouts = () => {
      spawnTimeouts.forEach(timeout => clearTimeout(timeout));
      moleTimeouts.forEach(timeout => clearTimeout(timeout));
      spawnTimeouts = [];
      moleTimeouts = [];
    };
    
    if (gameRunning) {
      const spawnSequence = () => {
        const currentTime = gameTimeRef.current;
        if (currentTime <= 0) return;
        
        const timeProgress = (30 - currentTime) / 30; // 0 to 1 as game progresses
        
        // More conservative difficulty curve - playable throughout
        // Start: 2000ms spawn delay, 1000ms visibility
        // End: 800ms spawn delay, 500ms visibility (minimum 300ms after modifiers)
        const baseSpawnDelay = Math.max(800, 2000 - (timeProgress * 1200));
        const baseVisibleTime = Math.max(500, 1000 - (timeProgress * 500));
        
        // Random difficulty modifiers (even less extreme for end game)
        const variationRange = timeProgress > 0.8 ? 0.2 : 0.4; // Less variation in final seconds
        const difficultyBonus = Math.random() * variationRange + (timeProgress > 0.8 ? 0.9 : 0.8);
        const spawnDelay = baseSpawnDelay * difficultyBonus;
        const visibleTime = Math.max(350, baseVisibleTime * difficultyBonus); // Higher minimum for end game
        
        // Determine spawn pattern based on difficulty
        const patterns = [
          'single',      // Normal single mole
          'fake_out',    // Quick flash then real mole elsewhere
          'rapid_fire',  // Quick sequence of 2-3 moles
          'multi_mole'   // Multiple moles at once
        ];
        
                 // Pattern probabilities change with time (more conservative end game)
         let patternWeights;
         if (timeProgress < 0.5) {
           patternWeights = [0.8, 0.15, 0.05, 0.0]; // Mostly single, few fake-outs
         } else if (timeProgress < 0.8) {
           patternWeights = [0.6, 0.25, 0.1, 0.05]; // More variety gradually but controlled
         } else {
           patternWeights = [0.7, 0.25, 0.05, 0.0]; // Final seconds: mostly single + fake-outs, no chaos
         }
        
        const pattern = weightedRandomChoice(patterns, patternWeights);
        
        console.log(`Time: ${currentTime}s, Pattern: ${pattern}, Spawn delay: ${Math.round(spawnDelay)}ms, Visible: ${Math.round(visibleTime)}ms`);
        
        switch (pattern) {
          case 'single':
            spawnSingleMole(visibleTime);
            break;
          case 'fake_out':
            spawnFakeOut(visibleTime);
            break;
          case 'rapid_fire':
            spawnRapidFire(visibleTime);
            break;
          case 'multi_mole':
            spawnMultipleMoles(visibleTime);
            break;
        }
        
        // Schedule next sequence
        const nextTimeout = setTimeout(() => {
          if (gameTimeRef.current > 0) {
            spawnSequence();
          }
        }, spawnDelay);
        spawnTimeouts.push(nextTimeout);
      };
      
      const spawnSingleMole = (visibleTime) => {
        const hole = Math.floor(Math.random() * NUM_HOLES);
        setActiveIndex(hole);
        
        const timeout = setTimeout(() => {
          setActiveIndex(null);
        }, visibleTime);
        moleTimeouts.push(timeout);
      };
      
      const spawnFakeOut = (visibleTime) => {
        // Quick flash at one hole
        const fakeHole = Math.floor(Math.random() * NUM_HOLES);
        setActiveIndex(fakeHole);
        
        const fakeTimeout = setTimeout(() => {
          setActiveIndex(null);
          
          // Real mole appears at different hole after short delay
          const realTimeout = setTimeout(() => {
            let realHole;
            do {
              realHole = Math.floor(Math.random() * NUM_HOLES);
            } while (realHole === fakeHole);
            
            setActiveIndex(realHole);
            
            const hideTimeout = setTimeout(() => {
              setActiveIndex(null);
            }, visibleTime);
            moleTimeouts.push(hideTimeout);
          }, 50 + Math.random() * 100); // 50-150ms delay
          moleTimeouts.push(realTimeout);
                 }, 120 + Math.random() * 80); // 120-200ms fake flash
        moleTimeouts.push(fakeTimeout);
      };
      
      const spawnRapidFire = (visibleTime) => {
        const holes = [];
        const sequenceLength = 2 + Math.floor(Math.random() * 2); // 2-3 moles
        
        // Generate sequence of different holes
        for (let i = 0; i < sequenceLength; i++) {
          let hole;
          do {
            hole = Math.floor(Math.random() * NUM_HOLES);
          } while (holes.includes(hole));
          holes.push(hole);
        }
        
        // Spawn sequence with short delays
        holes.forEach((hole, index) => {
          const showTimeout = setTimeout(() => {
            setActiveIndex(hole);
            
                         const hideTimeout = setTimeout(() => {
               setActiveIndex(null);
             }, Math.max(300, visibleTime * 0.6)); // Shorter visibility in rapid fire but minimum 300ms
            moleTimeouts.push(hideTimeout);
          }, index * (visibleTime * 0.3)); // Quick succession
          moleTimeouts.push(showTimeout);
        });
      };
      
      const spawnMultipleMoles = (visibleTime) => {
        // This is tricky with single activeIndex, so we'll do rapid alternating
        const holes = [];
        const moleCount = 2 + Math.floor(Math.random() * 2); // 2-3 moles
        
        for (let i = 0; i < moleCount; i++) {
          let hole;
          do {
            hole = Math.floor(Math.random() * NUM_HOLES);
          } while (holes.includes(hole));
          holes.push(hole);
        }
        
        // Rapidly alternate between holes to simulate multiple moles
        let currentMoleIndex = 0;
        const switchInterval = Math.max(100, visibleTime / (moleCount * 3)); // Minimum 100ms per switch
        
        const switchMole = () => {
          if (currentMoleIndex < holes.length * 3) { // Show each hole 3 times
            setActiveIndex(holes[currentMoleIndex % holes.length]);
            currentMoleIndex++;
            
            const switchTimeout = setTimeout(switchMole, switchInterval);
            moleTimeouts.push(switchTimeout);
          } else {
            setActiveIndex(null);
          }
        };
        
        switchMole();
      };
      
      const weightedRandomChoice = (choices, weights) => {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < choices.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            return choices[i];
          }
        }
        return choices[0];
      };
      
      // Start the chaos!
      spawnSequence();
    } else {
      setActiveIndex(null);
    }
    
    return () => {
      clearAllTimeouts();
    };
  }, [gameRunning]);

  // Game timer countdown and score saving
  useEffect(() => {
    let countdown;
    if (gameRunning && gameTime > 0) {
      countdown = setInterval(() => {
        setGameTime(t => {
          if (t <= 1) {
            const finalScore = scoreRef.current;
            console.log(`⏰ GAME ENDING! Final score: ${finalScore}, Player: "${playerName}"`);
            // Game will end after this update
            setGameRunning(false);
            setActiveIndex(null);
            
            // Stop background music
            if (backgroundPlayer) {
              backgroundPlayer.pause();
            }
            
            // Save score if player scored
            if (finalScore > 0 && playerName) {
              console.log('✅ Conditions met for saving score - calling saveGameScore()');
              saveGameScore();
            } else {
              console.log(`❌ Score not saved - Score: ${finalScore}, PlayerName: "${playerName}"`);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [gameRunning]); // Only depend on gameRunning, not gameTime

  const saveGameScore = async () => {
    const finalScore = scoreRef.current;
    console.log(`🔥 ATTEMPTING TO SAVE SCORE: Player: "${playerName}", Score: ${finalScore}`);
    try {
      // Save to local storage
      await saveLocalScore(playerName, finalScore);
      console.log('✅ Local score saved successfully');
      
      // Save to Firebase (cloud)
      console.log('🌐 Attempting to save to Firebase...');
      const cloudSaved = await saveScoreToCloud(playerName, finalScore);
      
      if (cloudSaved) {
        console.log('✅ Score saved to cloud successfully');
      } else {
        console.log('❌ Score NOT saved to cloud (check connection/permissions)');
      }
    } catch (error) {
      console.error('💥 Error saving score:', error);
    }
  };

  const handleNameSubmit = async (name) => {
    try {
      await savePlayerName(name);
      setPlayerName(name);
      setShowNameInput(false);
    } catch (error) {
      console.error('Error saving player name:', error);
      Alert.alert('Error', 'Failed to save your name. Please try again.');
    }
  };

  const handleStart = async () => {
    setScore(0);
    setGameTime(30);
    setGameRunning(true);
    
    // Start background music
    if (backgroundPlayer) {
      try {
        backgroundPlayer.seekTo(0);
        backgroundPlayer.play();
      } catch (error) {
        console.log('Error playing background music:', error);
      }
    }
  };

  const handleHit = () => {
    if (activeIndex !== null) {
      setScore(s => s + 1);
      setActiveIndex(null);
      
      // Play hit sound effect
      try {
        if (hitSoundPlayer) {
          hitSoundPlayer.seekTo(0);
          hitSoundPlayer.volume = 0.8;
          hitSoundPlayer.play();
        }
      } catch (error) {
        console.log('Error playing hit sound:', error);
      }
    }
  };

  const handleChangeName = () => {
    setShowNameInput(true);
  };

  if (!fontsLoaded || !isInitialized) {
    return null;
  }

  // Show name input screen if no player name is set
  if (showNameInput) {
    return (
      <NameInput 
        onNameSubmit={handleNameSubmit}
        existingName={playerName}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.nameButton}
          onPress={handleChangeName}
        >
          <Text style={styles.nameButtonText}>👤 {playerName}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>🎉 Smack-a-Moji 🎉</Text>
      <ScoreBoard score={score} />
      <Timer time={gameTime} />
      
      <View style={styles.board}>
        {[...Array(4)].map((_, row) => (
          <View key={row} style={styles.row}>
            {[...Array(4)].map((_, col) => {
              const index = row * 4 + col;
              return (
                <MoleHole
                  key={index}
                  isActive={index === activeIndex}
                  onHit={handleHit}
                  index={index}
                />
              );
            })}
          </View>
        ))}
      </View>
      
      {!gameRunning && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>
              {gameTime === 30 ? '🚀 Start Game' : `Final Score: ${score} - Play Again? 🔄`}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.leaderboardButton}
            onPress={() => setShowLeaderboard(true)}
          >
            <Text style={styles.leaderboardButtonText}>🏆 View Leaderboard</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {gameRunning && (
        <View style={styles.speedIndicator}>
          <Text style={styles.speedText}>
            Difficulty: {Math.round(((30 - gameTime) / 30) * 100)}%
          </Text>
        </View>
      )}

      <CloudLeaderboard 
        visible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentPlayerName={playerName}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  nameButton: {
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
  nameButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FF6B6B',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    color: '#FF6B6B',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  board: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  leaderboardButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  leaderboardButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  speedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  speedText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FF6B6B',
  },
}); 