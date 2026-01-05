# Life Plan App - Complete Setup Guide 🚀

## ✅ What Has Been Completed

Your **Life Plan** app is now fully implemented with:

### 🎨 **Premium UI/UX**
- Beautiful gradient headers and smooth animations
- Dark mode support throughout the app
- Timeline-specific color coding (Purple, Pink, Amber, Green, Blue)
- Premium cards with shadows and glassmorphism effects

### 🔐 **Authentication System**
- Sign Up screen with full validation
- Login screen with password toggle
- Firebase Authentication integration
- Persistent login with AsyncStorage
- User profile management

### 🎯 **Goal Management**
- Create goals with timeline selection (5, 10, 15, 20, 25+ years)
- Set priority levels (Low, Medium, High)
- Add descriptions and categories
- Track progress (0%, 25%, 50%, 75%, 100%)
- View goal details
- Delete goals
- Real-time sync with Firebase Firestore

### 📊 **Dashboard Features**
- Quick stats showing completed/in-progress goals
- Timeline cards showing goal counts
- Day streak tracking
- Pull-to-refresh functionality
- Real-time data updates

### 💪 **Wellness & Tips**
- Motivational daily tips
- Relaxation techniques (4-7-8 Breathing, Progressive Muscle Relaxation)
- SMART Goals framework
- Category filtering (Motivation, Techniques, Relaxation, Productivity)
- Inspirational quotes

---

## 📦 Installation Steps

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
cd "d:\Windsurf Projects\Life Plan\Life-Plan-main"
npm install
```

This will install all required packages including:
- Firebase SDK
- Expo modules
- React Navigation
- React Native Reanimated
- And more...

### Step 2: Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/

2. **Select Your Project**: `life-plan-51278`

3. **Enable Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Get Started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password"
   - Click "Save"

4. **Create Firestore Database**:
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Select "Start in test mode" (for development)
   - Choose your preferred location
   - Click "Enable"

5. **Set Up Firestore Rules** (Optional but recommended):
   
   In Firestore Database → Rules tab, replace with:
   
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Users can only read/write their own goals
       match /goals/{goalId} {
         allow read, write: if request.auth != null && 
                             resource.data.userId == request.auth.uid;
         allow create: if request.auth != null;
       }
     }
   }
   ```

---

## 🚀 Running the App

### For Android:
```powershell
npm run android
```

### For iOS (Mac only):
```powershell
npm run ios
```

### For Web:
```powershell
npm run web
```

### Start Development Server:
```powershell
npm start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for Web

---

## 📱 App Structure

```
Life-Plan-main/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # My Plan (Home) - Timeline & Goals
│   │   ├── explore.tsx        # Wellness & Tips
│   │   └── _layout.tsx        # Tab Navigation
│   ├── auth/
│   │   ├── login.tsx          # Login Screen
│   │   └── signup.tsx         # Sign Up Screen
│   ├── goals/
│   │   ├── create.tsx         # Create Goal Screen
│   │   └── [id].tsx           # Goal Detail Screen
│   └── _layout.tsx            # Root Layout with Auth Provider
├── constants/
│   ├── firebase.ts            # Firebase Configuration ✅
│   └── theme.ts               # Premium Color Palette
├── contexts/
│   └── AuthContext.tsx        # Authentication Context
├── services/
│   └── firestore.ts           # Firestore Database Functions
└── components/                # Reusable UI Components
```

---

## 🎯 How to Use the App

### First Time Setup:
1. Launch the app
2. Click "Sign Up" 
3. Enter your name, email, and password
4. You'll be automatically logged in

### Creating Goals:
1. On the home screen, tap a timeline card (e.g., "5 Year Goals")
2. Fill in the goal details:
   - Title (required)
   - Description
   - Category
   - Priority level
3. Tap "Create Goal"

### Tracking Progress:
1. Tap on any timeline card
2. Tap on a goal to view details
3. Use the progress buttons (0%, 25%, 50%, 75%, 100%)
4. Goals automatically update status:
   - 0% = Not Started
   - 1-99% = In Progress
   - 100% = Completed

### Viewing Tips:
1. Go to "Wellness" tab
2. Browse motivational tips
3. Read guided techniques
4. Filter by category

---

## 🎨 Features You Can Add Next

### Easy Additions:
- [ ] Profile photo upload
- [ ] Goal categories customization
- [ ] Export goals as PDF
- [ ] Share goals with friends
- [ ] Dark/Light theme toggle

### Advanced Features:
- [ ] Push notifications for reminders
- [ ] Goal milestones and sub-tasks
- [ ] Progress charts and analytics
- [ ] Social features (share achievements)
- [ ] AI-powered goal suggestions

---

## 🔧 Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Run `npm install` again

### Issue: Firebase not connecting
**Solution**: 
1. Check that Firebase is enabled in console
2. Verify `constants/firebase.ts` has correct config
3. Check internet connection

### Issue: App crashes on startup
**Solution**:
1. Clear Metro bundler cache: `npm start -- --reset-cache`
2. Delete `node_modules` and run `npm install` again

### Issue: Authentication not working
**Solution**:
1. Verify Email/Password is enabled in Firebase Console
2. Check Firestore rules allow user document creation

---

## 📚 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Authentication + Firestore)
- **State Management**: React Context API
- **Animations**: React Native Reanimated
- **Styling**: StyleSheet with custom theme
- **Storage**: AsyncStorage for persistence

---

## 🎉 You're All Set!

Your Life Plan app is ready to help you achieve your goals! The app is fully functional with:

✅ User authentication  
✅ Goal creation and management  
✅ Progress tracking  
✅ Firebase data persistence  
✅ Premium UI/UX  
✅ Wellness tips and techniques  

**Next Steps:**
1. Run `npm install`
2. Set up Firebase Console
3. Run `npm start`
4. Start planning your future! 🚀

---

## 📞 Need Help?

- **Firebase Docs**: https://firebase.google.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev

**Happy Goal Setting! 🎯**
