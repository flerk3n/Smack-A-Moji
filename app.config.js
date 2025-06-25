export default {
  expo: {
    name: "Smack-a-Moji",
    slug: "smack-a-moji",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    description: "The ultimate whack-a-mole game with animated emojis! Test your reflexes and compete on global leaderboards.",
    keywords: ["game", "whack-a-mole", "emoji", "arcade", "leaderboard", "fun"],
    primaryColor: "#FF6B6B",
    assetBundlePatterns: [
      "**/*"
    ],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FFE4E1"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.EXPO_PUBLIC_BUNDLE_ID || "com.yourcompany.smackamoji",
      buildNumber: "1.0.0",
      infoPlist: {
        CFBundleDisplayName: "Smack-a-Moji",
        NSCameraUsageDescription: "This app does not use the camera."
      }
    },
    android: {
      package: process.env.EXPO_PUBLIC_BUNDLE_ID || "com.yourcompany.smackamoji",
      versionCode: 1,
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFE4E1"
      },
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      minSdkVersion: 21,
      edgeToEdgeEnabled: true,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "VIBRATE"
      ],
      jsEngine: "hermes", // Enable Hermes for better performance
      allowBackup: false
    },
    web: {
      favicon: "./assets/favicon.png",
      name: "Smack-a-Moji",
      shortName: "Smack-a-Moji",
      lang: "en",
      scope: "/",
      themeColor: "#FF6B6B",
      backgroundColor: "#FFE4E1",
      display: "standalone"
    },
    plugins: [
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Poppins-Regular.ttf",
            "./assets/fonts/Poppins-Bold.ttf"
          ]
        }
      ],
      [
        "expo-audio",
        {
          supportsBackgroundAudio: false,
          enableLegacyAudioSupport: true
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "cfc98f1d-7180-475a-b9f3-43ec7a2b1545"
      },
      // Game configuration
      gameConfig: {
        maxScore: parseInt(process.env.EXPO_PUBLIC_MAX_SCORE) || 1000,
        gameDuration: parseInt(process.env.EXPO_PUBLIC_GAME_DURATION) || 30,
        leaderboardLimit: parseInt(process.env.EXPO_PUBLIC_LEADERBOARD_LIMIT) || 10
      }
    }
  }
}; 