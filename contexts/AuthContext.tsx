import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth } from '@/constants/firebase';
import { createUserProfile, getUserProfile, updateUserProfile, UserProfile, deleteUserData } from '@/services/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, avatar?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore, ignore offline errors
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          console.log('User profile fetched successfully');
          setUserProfile(profile);
        } catch (error: any) {
          if (error.code !== 'unavailable') {
            console.error('Error fetching user profile:', error);
          }
          // Keep userProfile null on offline/error; app remains usable
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string, avatar?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile in Firestore with avatar
      await createUserProfile(userCredential.user.uid, email, displayName, avatar);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateDisplayName = async (name: string) => {
    const current = auth.currentUser;
    if (!current) {
      throw new Error('No user is currently signed in');
    }

    try {
      await updateProfile(current, { displayName: name });
      await updateUserProfile(current.uid, { displayName: name });
      setUserProfile((prev) => (prev ? { ...prev, displayName: name } : prev));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const deleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Delete user data from Firestore first
      await deleteUserData(user.uid);
      
      // Delete Firebase Auth user
      await deleteUser(user);
      
      // Clear local state
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    deleteAccount,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
