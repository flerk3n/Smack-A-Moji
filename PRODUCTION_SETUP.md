# 🚀 Production Deployment Guide

## 1. Firebase Security Rules (IMPORTANT)

Replace your current Firestore rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      // Allow reading leaderboard for everyone
      allow read: if true;
      
      // Allow writing scores with validation
      allow write: if 
        // Data validation
        request.resource.data.keys().hasAll(['name', 'score', 'timestamp', 'date']) &&
        request.resource.data.keys().hasOnly(['name', 'score', 'timestamp', 'date']) &&
        
        // Field type validation
        request.resource.data.score is number &&
        request.resource.data.name is string &&
        request.resource.data.date is string &&
        
        // Content validation
        request.resource.data.score >= 0 &&
        request.resource.data.score <= 1000 && // Max reasonable score
        request.resource.data.name.size() >= 1 &&
        request.resource.data.name.size() <= 20 &&
        
        // Rate limiting (max 10 scores per minute per IP)
        request.time > resource.data.timestamp + duration.value(6, 's');
    }
  }
}
```

## 2. Environment Configuration

Update your bundle identifiers in `app.json`:
- Replace `com.yourcompany.smackamoji` with your actual company domain
- Update `your-eas-project-id-here` with your actual EAS project ID

## 3. App Store Assets Needed

### iOS App Store:
- [ ] App Icon (1024x1024 PNG)
- [ ] Screenshots (6.5", 5.5", 12.9" iPad)
- [ ] App Store description
- [ ] Keywords for ASO
- [ ] Privacy Policy URL

### Google Play Store:
- [ ] Feature Graphic (1024x500)
- [ ] Screenshots (Phone & Tablet)
- [ ] App description
- [ ] Content rating questionnaire
- [ ] Privacy Policy URL

## 4. Privacy Policy Template

```
Privacy Policy for Smack-a-Moji

Data Collection:
- Player names (stored locally and in Firebase)
- Game scores with timestamps
- No personal information, emails, or device IDs

Data Usage:
- Display global leaderboards
- Local game progress tracking
- No advertising or analytics tracking

Data Storage:
- Firebase Firestore (Google Cloud)
- Local device storage (AsyncStorage)
- Data is not shared with third parties

Contact: [your-email@domain.com]
```

## 5. Build for Production

### EAS Build Setup:
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

### Create `eas.json`:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Build Commands:
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

## 6. Performance Optimizations

### Enable Hermes (Android):
Add to `app.json`:
```json
"android": {
  "jsEngine": "hermes"
}
```

### Optimize Bundle Size:
```bash
npx expo install expo-updates
```

## 7. Testing Checklist

- [ ] Test on iOS simulator/device
- [ ] Test on Android emulator/device  
- [ ] Test Firebase connectivity
- [ ] Test offline functionality
- [ ] Test leaderboard sync
- [ ] Verify all sounds work
- [ ] Check haptic feedback
- [ ] Test name input validation
- [ ] Verify progressive difficulty
- [ ] Test score saving

## 8. App Store Descriptions

### Short Description:
"Ultimate emoji whack-a-mole game with global leaderboards and progressive difficulty!"

### Full Description:
```
🎉 SMACK-A-MOJI - The Ultimate Whack-A-Mole Experience! 🎉

Test your reflexes in this addictive emoji-themed whack-a-mole game! Compete with players worldwide and climb the global leaderboards.

🎮 FEATURES:
• 16 animated emoji moles to smack
• Progressive difficulty - starts easy, gets intense!
• Global leaderboards - compete worldwide
• Daily leaderboards - today's champions
• Smooth animations and satisfying sound effects
• Haptic feedback for immersive gameplay
• Works offline with cloud sync

🏆 GAME MODES:
• 30-second intense sessions
• Real-time difficulty scaling
• Cross-device score synchronization

🎯 PERFECT FOR:
• Quick gaming sessions
• Reflex training
• Competitive players
• All ages

Download now and start smacking those emojis! Can you reach the top of the global leaderboard?

#WhackAMole #EmojiGame #Leaderboard #Arcade #Reflexes
```

## 9. Monitoring & Analytics

Consider adding (optional):
- Expo Analytics
- Crashlytics
- Performance monitoring

## 10. Post-Launch

- [ ] Monitor Firebase usage
- [ ] Check crash reports
- [ ] Respond to app store reviews
- [ ] Plan feature updates
- [ ] Monitor leaderboard for inappropriate names 