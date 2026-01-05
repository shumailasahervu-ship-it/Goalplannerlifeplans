# Life Plan 📱

> A premium React Native + Expo mobile app for comprehensive life planning and goal achievement

## ✨ Features

- **📅 Life Timeline Planning**: Set and track goals for 5, 10, 15, 20, and 25+ year horizons
- **🎯 Goal Management**: Create, track, and achieve your life goals with progress visualization
- **💪 Wellness & Tips**: Daily motivational tips and relaxation techniques
- **🧘 Guided Techniques**: Step-by-step breathing exercises, SMART goals framework, and more
- **🔥 Progress Tracking**: Track your daily streaks and accomplishments
- **🎨 Premium UI/UX**: Beautiful, modern design with smooth animations
- **🌓 Dark Mode**: Full support for light and dark themes
- **🔐 Firebase Integration**: Secure authentication and cloud data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the project directory**:
```bash
cd "Life-Plan-main"
```

3. **Install dependencies**:
```bash
npm install
```

4. **Start the development server**:
```bash
npm start
```

### Running on Different Platforms

#### 📱 Android
```bash
npm run android
```

#### 🍎 iOS
```bash
npm run ios
```

#### 🌐 Web
```bash
npm run web
```

## 🏗️ Project Structure

```
Life-Plan-main/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # My Plan (Home) screen
│   │   ├── explore.tsx    # Wellness & Tips screen
│   │   └── _layout.tsx    # Tab navigation layout
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── components/            # Reusable React components
├── constants/             # Theme, colors, and Firebase config
│   ├── theme.ts          # Premium color palette and design system
│   └── firebase.ts       # Firebase configuration (create this file)
├── hooks/                 # Custom React hooks
├── assets/               # Images, fonts, and other static files
└── package.json          # Project dependencies
```

## 🔥 Firebase Setup

### Step 1: Create Firebase Configuration File

Create a file at `constants/firebase.ts` with the following content:

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbWRGOuZ5elogCydHDnSr-Tx_rqpobl8s",
  authDomain: "life-plan-51278.firebaseapp.com",
  projectId: "life-plan-51278",
  storageBucket: "life-plan-51278.firebasestorage.app",
  messagingSenderId: "353998024239",
  appId: "1:353998024239:web:6b2602fda8dffe592be0da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
```

### Step 2: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **life-plan-51278**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. Navigate to **Firestore Database** > **Create database**
6. Start in **test mode** (you can update rules later)

## 🎨 Color Palette

The app features a premium color palette:

- **Primary**: Indigo (#6366F1)
- **Secondary**: Pink (#EC4899)
- **Accent**: Green (#10B981)
- **Warning**: Amber (#F59E0B)

### Timeline Colors
- 5 Years: Purple
- 10 Years: Pink
- 15 Years: Amber
- 20 Years: Green
- 25+ Years: Blue

## 📦 Key Dependencies

- **expo**: ~54.0.23
- **react**: 19.1.0
- **react-native**: 0.81.5
- **expo-router**: ~6.0.14
- **firebase**: ^10.13.0
- **expo-linear-gradient**: ~14.0.7
- **expo-blur**: ~14.0.4
- **react-native-reanimated**: ~4.1.1

## 🚧 Roadmap

- [x] Premium UI theme and design system
- [x] Life timeline planning interface
- [x] Wellness tips and techniques
- [x] Firebase configuration
- [ ] User authentication (Sign up/Login)
- [ ] Goal creation and management
- [ ] Progress tracking and analytics
- [ ] Push notifications for goal reminders
- [ ] Data synchronization with Firestore
- [ ] Profile customization
- [ ] Export and share goals

## 🤝 Contributing

This is a personal life planning app. Feel free to fork and customize for your own needs!

## 📄 License

Private project

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- Icons by [Ionicons](https://ionic.io/ionicons)

---

**Made with ❤️ for better life planning**
