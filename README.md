<div align="center">
  <img src="icon.png" alt="Smack-a-Moji App Icon" width="128" height="128" />
  
  # 🎉 Smack-a-Moji 🎯
  
  *A fun and challenging React Native whack-a-mole game featuring animated emojis, progressive difficulty, and global leaderboards!*
  
  <img src="https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  
</div>

## 📸 Screenshots

*Game screenshots will be added here*

## 🎮 Game Features

### ⚡ Dynamic Gameplay
- **16-hole grid** (4×4) for intense action
- **26 animated emoji moles** from your collection
- **Progressive difficulty** - gets faster as time runs out
- **Multiple spawn patterns**: Single, fake-outs, rapid fire, and multi-mole chaos
- **30-second rounds** with live scoring

### 🎨 Visual & Audio
- **Beautiful animations** with smooth emoji transitions  
- **Background music** and sound effects
- **Haptic feedback** for hits
- **Modern UI** with Poppins fonts
- **Responsive design** for all screen sizes

### 🏆 Leaderboard System
- **Global leaderboard** - compete with players worldwide
- **Daily leaderboard** - see today's top scores
- **Firebase integration** for real-time score syncing
- **Player profiles** with persistent names

### 🔧 Advanced Features
- **Fake-out moles** - quick flashes before real spawns
- **Rapid fire sequences** - multiple moles in quick succession
- **Dynamic speed scaling** - from 2000ms to 800ms spawn delays
- **Smart difficulty** - patterns get more complex over time

## 📱 Tech Stack

- **React Native** with Expo
- **Firebase Firestore** for cloud leaderboards
- **Expo Audio** for background music and sound effects
- **Expo Haptics** for tactile feedback
- **Custom fonts** (Poppins family)
- **Async Storage** for local data

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio or Xcode (for device testing)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ReactNative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy `.env.example` to `.env`
   - Add your Firebase project credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase keys
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🔥 Firebase Setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Create in production mode
   - Set up security rules (see `PRODUCTION_SETUP.md`)

3. **Get your config keys**
   - Project Settings → General → Web apps
   - Copy the config object values to your `.env` file

4. **Environment Variables Required:**
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## 🎯 How to Play

1. **Enter your name** when first launching the app
2. **Tap "🚀 Start Game"** to begin a 30-second round
3. **Tap the emoji moles** as quickly as possible when they appear
4. **Watch out for fake-outs** - moles that flash briefly before appearing elsewhere
5. **Adapt to increasing speed** - the game gets faster as time runs out
6. **Check the leaderboard** to see how you rank globally!

## 📊 Game Mechanics

### Difficulty Progression
- **Start (30s)**: 2000ms spawn delays, 1000ms visibility
- **Mid-game (15s)**: ~1400ms spawn delays, ~750ms visibility  
- **End game (5s)**: 800ms spawn delays, 500ms visibility
- **Minimum visibility**: 350ms (always playable)

### Spawn Patterns
- **Single Mole** (70% early, 70% late): Classic gameplay
- **Fake-out** (15-25%): Quick flash then real mole elsewhere
- **Rapid Fire** (5-25%): 2-3 moles in quick succession
- **Multi-Mole** (0-15%): Rapid alternating between holes

## 🏗️ Project Structure

```
📦 Smack-a-Moji
├── 📁 assets/
│   ├── 📁 emojis/          # 26 animated emoji WebP files
│   ├── 📁 fonts/           # Poppins font family
│   └── 📁 sounds/          # Background music & sound effects
├── 📁 components/
│   ├── 🎯 MoleHole.js      # Individual hole component
│   ├── 📊 ScoreBoard.js    # Score display
│   ├── ⏱️ Timer.js         # Countdown timer
│   ├── 👤 NameInput.js     # Player name entry
│   └── 🏆 CloudLeaderboard.js # Global leaderboard
├── 📁 config/
│   └── 🔥 firebase.js      # Firebase configuration
├── 📁 utils/
│   ├── 💾 storage.js       # Local storage utilities
│   └── ☁️ firebaseStorage.js # Cloud storage utilities
├── 🎮 App.js               # Main game logic
└── 📋 app.json             # Expo configuration
```

## 🚀 Building for Production

See `PRODUCTION_SETUP.md` for detailed build and deployment instructions including:
- EAS Build configuration
- App store preparation
- Security best practices
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Credits

- **Emoji Graphics**: Custom animated WebP collection
- **Sound Effects**: Custom audio for mole pops and background music
- **Fonts**: Poppins font family
- **Framework**: React Native with Expo
- **Database**: Firebase Firestore

## 📞 Support

If you encounter any issues or have questions:
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 📧 Contact: harshrj.dev@gmail.com

---

**Made with ❤️ and lots of ☕ by Harsh**

*Ready to smack some moji? Let's play! 🎯* 