import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const WebHomePage = ({ onPlayOnline }) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isMobile = screenData.width < 768;
  const isTablet = screenData.width >= 768 && screenData.width < 1024;

  const handleDownloadAndroid = () => {
    // This will be the download link for the Android APK
    // You can replace this URL with your actual APK download link
    const downloadUrl = 'https://your-app-download-link.com/smack-a-moji.apk';
    window.open(downloadUrl, '_blank');
  };

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Game Logo */}
      <View style={[styles.logoContainer, isMobile && styles.logoContainerMobile]}>
        <Image 
          source={require('../assets/icon.png')}
          style={[styles.logo, isMobile && styles.logoMobile]}
          contentFit="contain"
        />
        <Text style={[styles.title, isMobile && styles.titleMobile]}>🎉 Smack-a-Moji 🎉</Text>
        <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
          The ultimate whack-a-mole game with animated emojis!
        </Text>
      </View>

      {/* Buttons */}
      <View style={[styles.buttonContainer, isMobile && styles.buttonContainerMobile]}>
        <TouchableOpacity style={[styles.playButton, isMobile && styles.playButtonMobile]} onPress={onPlayOnline}>
          <Text style={[styles.playButtonText, isMobile && styles.playButtonTextMobile]}>🎮 Play Online</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDownloadAndroid}>
          <Image 
            source={require('../assets/apkbadge.svg')}
            style={[styles.apkBadge, isMobile && styles.apkBadgeMobile]}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={[styles.featuresContainer, isMobile && styles.featuresContainerMobile]}>
        <Text style={[styles.featuresTitle, isMobile && styles.featuresTitleMobile]}>🌟 Game Features</Text>
        <View style={styles.featuresList}>
          <Text style={[styles.featureItem, isMobile && styles.featureItemMobile]}>🎯 Test your reflexes with animated emojis</Text>
          <Text style={[styles.featureItem, isMobile && styles.featureItemMobile]}>🏆 Compete on global leaderboards</Text>
          <Text style={[styles.featureItem, isMobile && styles.featureItemMobile]}>🎵 Immersive sound effects</Text>
          <Text style={[styles.featureItem, isMobile && styles.featureItemMobile]}>📱 Available on Android & Web</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  containerMobile: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainerMobile: {
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoMobile: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 48,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  titleMobile: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#666',
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 24,
  },
  subtitleMobile: {
    fontSize: 16,
    maxWidth: 300,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 20,
  },
  buttonContainerMobile: {
    marginBottom: 30,
    gap: 15,
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1 }],
  },
  playButtonMobile: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  playButtonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playButtonTextMobile: {
    fontSize: 20,
  },
  apkBadge: {
    width: 350,
    height: 150,
  },
  apkBadgeMobile: {
    width: 250,
    height: 107,
  },
  featuresContainer: {
    alignItems: 'center',
    maxWidth: 600,
  },
  featuresContainerMobile: {
    maxWidth: '100%',
    paddingHorizontal: 10,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  featuresTitleMobile: {
    fontSize: 20,
    marginBottom: 15,
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#555',
    marginBottom: 8,
    textAlign: 'left',
  },
  featureItemMobile: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
    width: '100%',
  },
});

export default WebHomePage; 