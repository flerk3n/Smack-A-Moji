import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function NameInput({ onNameSubmit, existingName }) {
  const [name, setName] = useState(existingName || '');
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      Alert.alert('Invalid Name', 'Please enter at least 2 characters for your name.');
      return;
    }
    if (trimmedName.length > 20) {
      Alert.alert('Name Too Long', 'Please keep your name under 20 characters.');
      return;
    }
    onNameSubmit(trimmedName);
  };

  const handleSkip = () => {
    onNameSubmit('Anonymous Player');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>Enter Your Name</Text>
        <Text style={styles.subtitle}>Join the global leaderboard!</Text>
        
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your awesome name..."
          placeholderTextColor="#999"
          maxLength={20}
          autoFocus={!existingName}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        
        <Text style={styles.charCount}>{name.length}/20</Text>
        
        <TouchableOpacity 
          style={[styles.submitButton, !name.trim() && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Text style={styles.submitButtonText}>
            {existingName ? 'Update Name' : 'Start Playing'} 🚀
          </Text>
        </TouchableOpacity>
        
        {!existingName && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip (Play as Anonymous)</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips:</Text>
          <Text style={styles.tip}>• Your name will appear on the global leaderboard</Text>
          <Text style={styles.tip}>• You can change it anytime in settings</Text>
          <Text style={styles.tip}>• Keep it fun and appropriate!</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#FFF',
    textAlign: 'center',
    color: '#333',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    marginTop: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  tipsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
}); 